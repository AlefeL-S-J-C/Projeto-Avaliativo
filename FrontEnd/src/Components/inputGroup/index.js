const InputGroup =({
    type, placeholder, name, onChange, label, min, step, value
}) =>{
    return (
        <div className="input-group mb-3">
            <span className="input-group-text">{label}</span>
            <input className="form-control"
            type={type}
            placeholder={placeholder} 
            name={name}
            min={min}
            step={step}
            value={value}
            onChange ={onChange }
            />
        </div>
    )
}

export default InputGroup;