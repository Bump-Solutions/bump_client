import {useState} from 'react';

// const [isToggle, toggleIsToggle] = useToggle(false);

export const useToggle = (defaultValue: boolean): [boolean, (value?: boolean) => void] => {
  const [value, setValue] = useState<boolean>(defaultValue);

  const toggleValue = (newValue?: boolean) => {
    setValue((currentValue) => (typeof newValue === 'boolean' ? newValue : !currentValue));
  };

  return [value, toggleValue];
};
