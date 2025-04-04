import { For } from "solid-js";
import { languageOptions } from "@locales";

const LanguageDropdown = (props) => {
  // Find current language option object
  const getCurrentLanguage = () => {
    return (
      languageOptions.find((lang) => lang.code === props.currentLang()) ||
      languageOptions[0]
    );
  };

  return (
    <div class={"relative block"} ref={props.ref}>
      <button
        onClick={() => props.setDropdownOpen(!props.dropdownOpen())}
        class="flex items-center md:hover:bg-gray-200 p-1 md:p-2 rounded-md text-gray-600"
      >
        <span class="flag-emoji text-xl">{getCurrentLanguage().flag}</span>
      </button>

      <div
        class={`absolute right-0 top-full mt-2 w-32 bg-white rounded-md shadow-lg py-1 z-20 origin-top-right transform transition-all duration-200 ease-in-out ${
          props.dropdownOpen()
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <For each={languageOptions}>
          {(lang) => (
            <button
              onClick={() => props.selectLanguage(lang.code)}
              class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-500"
            >
              <span class="mr-2 flag-emoji">{lang.flag}</span> {lang.name}
            </button>
          )}
        </For>
      </div>
    </div>
  );
};

export default LanguageDropdown;
