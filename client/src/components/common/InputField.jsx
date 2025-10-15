const InputField = ({ placeholder, label, type, name, register, errors }) => {
    return (
      <div className="flex flex-col my-3">
        <label className="hidden text-sm text-gray-700 dark:text-gray-300">{label}</label>
        <input
            placeholder={placeholder}
          {...register(name)}
          type={type}
          className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white dark:bg-gray-800 dark:placeholder-gray-300 dark:focus:border-gray-100 dark:focus:bg-gray-900 dark:text-gray-200"
        />
        {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]?.message}</p>}
      </div>
    );
  };
  export default InputField;
  