import { useState } from 'react';
interface DropdownProps {
    /** The text to display inside the button */
    callback: Function;
  }
function Dropdown({callback} : DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState({ value: 'grid1', label: 'Grid 1' });

  const [options, setOptions] = useState([
    { value: 'grid1', label: 'Grid 1' },
    { value: 'create', label: 'New Grid' }
  ])

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: any) => {
    if(option.value === 'create') {
        
        let newInd = options.length
        let newOption = [{ value: `grid${newInd}`, label: `Grid ${newInd}` }]
        let temp = newOption.concat(options)
        setSelectedOption(newOption[0]);
        setOptions(temp)
        if(callback) {
            callback(newOption[0].value)
        }
    } else {
        setSelectedOption(option);
        if(callback) {
            callback(option.value)
        }
    }
    setIsOpen(false);
  };

  return (
    <div className="dropdown">
      <button className="link" onClick={toggleDropdown}>
        {selectedOption ? selectedOption.label : 'Select an option'}
        <div className={`menu ${isOpen ? 'open' : ''}`}>
                <ul className="dropdown-list">
                {options.map((option) => (
                    <li
                    key={option.value}
                    onClick={() => handleOptionClick(option)}
                    className="dropdown-item"
                    >
                    {option.label}
                    </li>
                ))}
                </ul>
        </div>
      </button>
    </div>
  );
}

export default Dropdown;