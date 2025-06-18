import React, { useEffect, useRef, useState, JSX, ChangeEvent } from "react";
import { Option } from "../types/form";

import { X, Search, ChevronDown, ChevronUp } from "lucide-react";

import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  FloatingPortal,
} from "@floating-ui/react";

interface SelectProps {
  value: Option | Option[] | null;
  label: string;
  placeholder: string;
  options: Option[];
  isMulti?: boolean;
  isSearchable?: boolean;
  onChange: (value: Option | Option[] | null) => void;
  required?: boolean;
  name: string;
  error?: string;
  className?: string;
  tabIndex?: number;
}

const Select = ({
  value,
  label,
  placeholder,
  options,
  isMulti = false,
  isSearchable = false,
  onChange,
  required = false,
  name,
  error,
  className,
  tabIndex,
}: SelectProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedValue, setSelectedValue] = useState<Option[] | Option | null>(
    value || (isMulti ? [] : null)
  );
  const [searchValue, setSearchValue] = useState("");

  const searchRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  const hasSelectedValue = isMulti
    ? (selectedValue as Option[]).length > 0
    : Boolean(selectedValue);

  const { x, y, refs, strategy, update, context } = useFloating({
    middleware: [offset(4), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });

  useEffect(() => {
    setSearchValue("");
    if (showMenu && searchRef.current) {
      searchRef.current.focus();
    }
  }, [showMenu]);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    };

    window.addEventListener("click", handler);

    return () => {
      window.removeEventListener("click", handler);
    };
  }, []);

  const handleInputClick = () => {
    setShowMenu(!showMenu);
  };

  const getDisplay = (): string | JSX.Element => {
    if (
      !selectedValue ||
      (Array.isArray(selectedValue) && selectedValue.length === 0)
    ) {
      return placeholder;
    }
    if (isMulti && Array.isArray(selectedValue)) {
      return (
        <div className='dropdown__tags'>
          {selectedValue.map((option, index) => (
            <div
              key={`${option.value}-${index}`}
              className='dropdown__tag__item'>
              {option.label}
              <span
                onClick={(e) => onTagRemove(e, option)}
                className='dropdown__tag__close'>
                <X />
              </span>
            </div>
          ))}
        </div>
      );
    }
    return (selectedValue as Option).label;
  };

  const removeOption = (option: Option): Option[] => {
    return (selectedValue as Option[]).filter((o) => o.value !== option.value);
  };

  const onTagRemove = (
    e: React.MouseEvent<HTMLSpanElement>,
    option: Option
  ) => {
    e.stopPropagation();
    const newValue = removeOption(option);
    setSelectedValue(newValue);
    onChange(newValue);
  };

  const onItemClick = (option: Option) => {
    let newValue: Option[] | Option | null;

    if (isMulti) {
      const currentValue = selectedValue as Option[];
      if (currentValue.some((o) => o.value === option.value)) {
        newValue = currentValue.filter((o) => o.value !== option.value);
      } else {
        newValue = [...currentValue, option];
      }
    } else {
      newValue = option;
    }

    setSelectedValue(newValue);
    onChange(newValue);
    if (!isMulti) setShowMenu(false);
  };

  const isSelected = (option: Option): boolean => {
    if (isMulti) {
      return (selectedValue as Option[]).some((o) => o.value === option.value);
    }
    return (selectedValue as Option)?.value === option.value;
  };

  const onSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const getOptions = (): Option[] => {
    if (!searchValue) return options;
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(searchValue.toLowerCase()) ||
        (option.description &&
          option.description.toLowerCase().includes(searchValue.toLowerCase()))
    );
  };

  const onReset = () => {
    const resetValue = isMulti ? [] : null;
    setSelectedValue(resetValue);
    onChange(resetValue);
  };

  return (
    <div className={`dropdown ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className={`${showMenu ? "focused" : ""} ${
            hasSelectedValue ? "filled" : ""
          } ${error ? "error" : ""}`}>
          {label}
          {required && <span className='required'> *</span>}
        </label>
      )}

      <div className='dropdown__container'>
        <div
          ref={(node) => {
            inputRef.current = node;
            refs.setReference(node);
          }}
          id={name}
          onClick={handleInputClick}
          className={`dropdown__input ${showMenu ? "focused" : ""} ${
            hasSelectedValue ? "filled" : ""
          } ${error ? "error" : ""}`}
          tabIndex={tabIndex}>
          <div
            className={`dropdown__selected-value ${
              !selectedValue ||
              (Array.isArray(selectedValue) && selectedValue.length === 0)
                ? "placeholder"
                : ""
            }`}>
            {getDisplay()}
          </div>
          <div className='dropdown__tools'>
            <div className='dropdown__tool'>
              {showMenu ? <ChevronUp /> : <ChevronDown />}
            </div>
          </div>
        </div>
        {error && <p className='error-msg'>{error}</p>}
      </div>

      {showMenu && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            className={`dropdown__menu ${isMulti ? "multi" : ""}`}
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
              zIndex: 999999,
              width: inputRef.current?.offsetWidth ?? "auto",
            }}>
            {isSearchable && (
              <div className='search-box'>
                <Search />
                <input
                  className='form-control'
                  onChange={onSearch}
                  value={searchValue}
                  ref={searchRef}
                  placeholder='Keresés a listában'
                />
              </div>
            )}

            {hasSelectedValue && (
              <div onClick={onReset} className='dropdown__item reset'>
                Visszaállítás alaphelyzetbe
              </div>
            )}

            {getOptions().map((option: Option) => (
              <div
                onClick={() => onItemClick(option)}
                key={option.value}
                className={`dropdown__item ${
                  isSelected(option) ? "selected" : ""
                }`}>
                {option.label}
                {option.description && (
                  <p className='p-0 fs-14 fc-light'>{option.description}</p>
                )}
              </div>
            ))}
          </div>
        </FloatingPortal>
      )}
    </div>
  );
};

export default Select;
