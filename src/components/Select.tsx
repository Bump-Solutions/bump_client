import {
  useEffect,
  useRef,
  useState,
  JSX,
  ChangeEvent,
  useMemo,
  KeyboardEvent,
} from "react";

import { X, Search, ChevronDown, ChevronUp } from "lucide-react";

import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  FloatingPortal,
} from "@floating-ui/react";

export type Option<T = string | number> = {
  label: string;
  value: T;
  description?: string;
};

// Közös props
type BaseProps<T> = {
  name: string;
  options: Option<T>[];

  required?: boolean;
  placeholder?: string;

  isInvalid?: boolean;
  disabled?: boolean;

  isSearchable?: boolean;

  className?: string;
  tabIndex?: number;
};

type SingleProps<T> = BaseProps<T> & {
  isMulti?: false;
  value: T | null;
  onChange: (value: T | null) => void;
};

type MultiProps<T> = BaseProps<T> & {
  isMulti: true;
  value: T[];
  onChange: (value: T[]) => void;
};

type SelectProps<T = string | number> = SingleProps<T> | MultiProps<T>;

const Select = <T extends string | number>({
  name,
  options,
  value,

  required = false,
  placeholder = "Válassz az alábbiak közül...",

  isInvalid = false,
  disabled = false,

  isMulti = false,
  isSearchable = false,

  onChange,

  className,
  tabIndex,
  ...props
}: SelectProps<T>) => {
  // Gyors lookup a labelhez/descriptionhöz
  const byValue = useMemo(() => {
    const map = new Map<T, Option<T>>();

    for (const option of options) {
      map.set(option.value, option);
    }

    return map;
  }, [options]);

  // Menü + kereső state
  const [showMenu, setShowMenu] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  // Refs
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const floatingRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Floating UI (ajánlott API: refs + floatingStyles)
  const { refs, floatingStyles } = useFloating({
    whileElementsMounted: autoUpdate,
    middleware: [offset(4), flip(), shift({ padding: 8 })],
  });

  // Reference elem = trigger
  useEffect(() => {
    if (triggerRef.current) {
      refs.setReference(triggerRef.current);
    }
  }, [refs]);

  // Kereső fókusz, amikor nyitunk
  useEffect(() => {
    if (showMenu && isSearchable && searchRef.current) {
      // reseteljük az indexet és fókuszt rakunk a keresőre
      setActiveIndex(-1);
      searchRef.current.focus();
      searchRef.current.select?.();
    }

    if (!showMenu) {
      setSearchValue("");
      setActiveIndex(-1);
    }
  }, [showMenu, isSearchable]);

  // Click-outside
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        (triggerRef.current && triggerRef.current.contains(target)) ||
        (floatingRef.current && floatingRef.current.contains(target)) ||
        (searchRef.current && searchRef.current.contains(target))
      ) {
        return;
      }

      setShowMenu(false);
    };

    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  // Megjeleníthető opciók (kereső szerint)
  const visibleOptions = useMemo(() => {
    if (!searchValue) return options;

    const query = searchValue.toLowerCase();

    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(query) ||
        option.description?.toLowerCase().includes(query)
    );
  }, [options, searchValue]);

  // Kijelölt-e egy érték
  const isSelected = (v: T): boolean =>
    isMulti ? (value as T[]).includes(v) : value === v;

  // Toggle/select
  const selectValue = (v: T) => {
    if (disabled) return;

    if (isMulti) {
      const arr = value as T[];
      const next = arr.includes(v) ? arr.filter((i) => i !== v) : [...arr, v];
      (onChange as (val: T[]) => void)(next);
    } else {
      (onChange as (val: T | null) => void)(v);
      setShowMenu(false);
    }
  };

  // Reset
  const resetValue = () => {
    if (disabled) return;

    if (isMulti) {
      (onChange as (val: T[]) => void)([]);
    } else {
      (onChange as (val: T | null) => void)(null);
    }
  };

  // Megjelenített "selected" tartalom
  const renderDisplay = (): string | JSX.Element => {
    if (isMulti) {
      const values = value as T[];
      if (values.length === 0) return placeholder;
      return (
        <div className='dropdown__tags'>
          {values.map((value, index) => {
            const option = byValue.get(value);
            if (!option) return null;
            return (
              <div
                key={`${String(value)}-${index}`}
                className='dropdown__tag__item'>
                {option.label}
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    (onChange as (val: T[]) => void)(
                      values.filter((v) => v !== value)
                    );
                  }}
                  className='dropdown__tag__close'>
                  <X />
                </span>
              </div>
            );
          })}
        </div>
      );
    } else {
      if (value === null) return placeholder;
      const option = byValue.get(value as T);
      return option ? option.label : placeholder;
    }
  };

  // Kereső change
  const onSearch = (e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setSearchValue(e.target.value);
    setActiveIndex(0);
  };

  // Billentyűkezelés a triggeren
  const onTriggerKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    const hasItems = visibleOptions.length > 0;
    switch (e.key) {
      case " ":
      case "Enter":
      case "ArrowDown": {
        e.preventDefault();
        if (!showMenu) {
          setShowMenu(true);
          setActiveIndex(0);
        } else if (e.key === "ArrowDown" && hasItems) {
          setActiveIndex((i) => Math.min(i + 1, visibleOptions.length - 1));
        }
        break;
      }

      case "ArrowUp": {
        if (showMenu && hasItems) {
          e.preventDefault();
          setActiveIndex((i) => Math.max(i - 1, 0));
        }
        break;
      }

      case "Home":
        if (showMenu && hasItems) {
          e.preventDefault();
          setActiveIndex(0);
        }
        break;

      case "End":
        if (showMenu && hasItems) {
          e.preventDefault();
          setActiveIndex(visibleOptions.length - 1);
        }
        break;

      case "Escape":
        if (showMenu) {
          e.preventDefault();
          setShowMenu(false);
        }
        break;

      default:
        break;
    }
  };

  // Enter a listán
  const onListKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!showMenu) return;

    const hasItems = visibleOptions.length > 0;
    switch (e.key) {
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < visibleOptions.length) {
          selectValue(visibleOptions[activeIndex].value);
        }
        break;

      case "ArrowDown":
        if (hasItems) {
          e.preventDefault();
          setActiveIndex((i) => Math.min(i + 1, visibleOptions.length - 1));
        }
        break;

      case "ArrowUp":
        if (hasItems) {
          e.preventDefault();
          setActiveIndex((i) => Math.max(i - 1, 0));
        }
        break;

      case "Home":
        if (hasItems) {
          e.preventDefault();
          setActiveIndex(0);
        }
        break;

      case "End":
        if (hasItems) {
          e.preventDefault();
          setActiveIndex(visibleOptions.length - 1);
        }
        break;

      case "Escape":
        e.preventDefault();
        setShowMenu(false);
        break;

      default:
        break;
    }
  };

  const hasSelectedValue = isMulti
    ? (value as T[]).length > 0
    : value !== null && value !== undefined;

  // ARIA id-k
  const listboxId = `${name}-listbox`;
  const activeId =
    activeIndex >= 0 && activeIndex < visibleOptions.length
      ? `${name}-opt-${String(visibleOptions[activeIndex].value)}`
      : undefined;

  // cls
  const dropdownCls = `dropdown ${className ?? ""}`;
  const inputCls = [
    "dropdown__input",
    showMenu ? "focused" : "",
    hasSelectedValue ? "filled" : "",
    isInvalid ? "error" : "",
  ].join(" ");
  const selectedCls = [
    "dropdown__selected-value",
    hasSelectedValue ? "filled" : "",
  ].join(" ");

  return (
    <div className={dropdownCls} {...props}>
      <div className='dropdown__container'>
        <div
          ref={(node) => {
            triggerRef.current = node;
          }}
          id={name}
          role='combobox'
          title='Válassz...'
          aria-haspopup='listbox'
          aria-expanded={showMenu}
          aria-controls={listboxId}
          aria-activedescendant={activeId}
          aria-disabled={disabled || undefined}
          onClick={() => {
            if (disabled) return;
            setShowMenu((v) => !v);
          }}
          onKeyDown={onTriggerKeyDown}
          className={inputCls}
          tabIndex={tabIndex}>
          <div className={selectedCls}>{renderDisplay()}</div>
          <div className='dropdown__tools'>
            <div className='dropdown__tool'>
              {showMenu ? <ChevronUp /> : <ChevronDown />}
            </div>
          </div>
        </div>
      </div>

      {showMenu && (
        <FloatingPortal>
          <div
            ref={(node) => {
              floatingRef.current = node;
              refs.setFloating(node);
            }}
            className={`dropdown__menu ${isMulti ? "multi" : ""}`}
            style={{
              ...floatingStyles,
              zIndex: 999999,
              width: triggerRef.current?.offsetWidth ?? "auto",
            }}
            onKeyDown={onListKeyDown}>
            {isSearchable && (
              <div className='search-box'>
                <Search />
                <input
                  className='form-control'
                  onChange={onSearch}
                  value={searchValue}
                  ref={searchRef}
                  placeholder='Keresés a listában...'
                  autoComplete='off'
                />
              </div>
            )}

            {hasSelectedValue && (
              <div className='dropdown__item reset' onClick={resetValue}>
                Visszaállítás alaphelyzetbe
              </div>
            )}

            <div
              id={listboxId}
              role='listbox'
              aria-multiselectable={isMulti || undefined}>
              {visibleOptions.map((option, index) => {
                const selected = isSelected(option.value);
                const focused = index === activeIndex;

                const cls = [
                  "dropdown__item",
                  selected ? "selected" : "",
                  focused ? "focused" : "",
                ].join(" ");

                return (
                  <div
                    key={String(option.value)}
                    id={`${name}-opt-${String(option.value)}`}
                    role='option'
                    aria-selected={selected}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => selectValue(option.value)}
                    className={cls}>
                    {option.label}
                    {option.description && (
                      <p className='p-0 fs-14 fc-gray-600'>
                        {option.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </FloatingPortal>
      )}
    </div>
  );
};

export default Select;
