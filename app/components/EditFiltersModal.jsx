import { useAuthContext } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";

import Toggle from "./Toggle";

export default function EditFiltersModal() {
  const {
    filters,
    setFilters,
    showEditFiltersModal,
    setShowEditFiltersModal,
    habits,
    setHabits,
  } = useAuthContext();
  const [selectedFilter, setSelectedFilter] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterType, setFilterType] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [auxInfo, setAuxInfo] = useState([]);

  const timeoutId = useRef(null);

  function validateFilter() {
    var anyError = false;
    var errorMsg = [];
    var auxFilterType = filterType ? "negative" : "positive";

    if (!filterName) {
      anyError = true;
      errorMsg.push("Please fill all the fields");
    }

    if (filterName.length > 12) {
      anyError = true;
      errorMsg.push("Name is too long");
    }

    if (filterName === "all") {
      anyError = true;
      errorMsg.push("Name can't be 'all'");
    }

    if (
      filters.some(
        (filter) => filter.title === filterName && filter.type === auxFilterType
      )
    ) {
      anyError = true;
      errorMsg.push("Name already exists");
    }

    setAuxInfo(errorMsg);

    clearTimeout(timeoutId.current);

    timeoutId.current = setTimeout(() => {
      setAuxInfo([]);
    }, 6000);

    return !anyError;
  }

  function editHabits(changedFilter) {
    var newHabits = [...habits];
    var auxFilterType = filterType ? "negative" : "positive";

    newHabits.forEach((habit, index) => {
      if (
        habit.type === changedFilter.type &&
        habit.category === changedFilter.title
      ) {
        if (changedFilter.type == auxFilterType) {
          habit.category = filterName;
          //console.log("same type, changed category");
        } else {
          habit.category = "all";
          //console.log("different type, changed category to all");
        }
      }
    });

    setHabits(newHabits);
  }

  function cleanUpHabits(deletedFilter) {
    var newHabits = [...habits];

    newHabits.forEach((habit, index) => {
      if (
        habit.type === deletedFilter.type &&
        habit.category === deletedFilter.title
      ) {
        habit.category = "all";
        console.log("habit changed");
      }
    });

    setHabits(newHabits);
  }

  function deleteFilter() {
    cleanUpHabits(selectedFilter);

    var newFilters = [...filters];

    newFilters.forEach((filter, index) => {
      if (
        filter.title === selectedFilter.title &&
        filter.type === selectedFilter.type
      ) {
        newFilters.splice(index, 1);
      }
    });

    setFilters(newFilters);
    closeModal();
  }

  function editFilter() {
    if (!validateFilter()) return;

    editHabits(selectedFilter);

    var newFilters = [...filters];

    newFilters.forEach((filter) => {
      if (
        filter.title === selectedFilter.title &&
        filter.type === selectedFilter.type
      ) {
        filter.title = filterName;
        filter.type = filterType ? "negative" : "positive";
      }
    });

    setFilters(newFilters);
    closeModal();
  }

  function addNewFilter() {
    if (!validateFilter()) return;

    var newFilters = [...filters];

    newFilters.push({
      title: filterName,
      type: filterType ? "negative" : "positive",
    });

    setFilters(newFilters);
    closeModal();
  }

  function closeModal() {
    setShowEditFiltersModal(false);
    setIsEditing(false);
    resetFilter();
  }

  function resetFilter() {
    setSelectedFilter("");
    setFilterName("");
    setFilterType("");
  }

  useEffect(() => {
    if (!isEditing) resetFilter();
  }, [isEditing]);

  useEffect(() => {
    if (selectedFilter != "") {
      setFilterName(selectedFilter.title);
      setFilterType(selectedFilter.type === "negative" ? true : false);
    }
  }, [selectedFilter]);

  return (
    <>
      <div
        className={`${showEditFiltersModal ? "scale-100" : "scale-0"} 
        fixed p-5 w-[97%] max-w-md top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-50 rounded-md shadow-lg z-50 transtion-transform ease-out-expo duration-100`}
      >
        <h2 className={`pb-3 mb-4 border-b font-semibold text-center`}>
          Add or Edit filters
        </h2>

        <div className="mb-4">
          <Toggle
            getter={isEditing}
            setter={setIsEditing}
            firstOption="Add filter"
            secondOption="Edit existing"
          />
        </div>

        <div className="flex flex-col">
          <div className="flex flex-col mb-4">
            {isEditing && (
              <>
                <select
                  className="p-2 mb-4 border-2 rounded-md"
                  value={selectedFilter}
                  onChange={(e) => {
                    const selectedValue = JSON.parse(e.target.value);
                    setSelectedFilter(selectedValue);
                    setFilterName(selectedValue.title);
                  }}
                >
                  <option value="" hidden>
                    Select filter to edit...
                  </option>
                  {filters
                    .filter((filter, title, type) => filter.title != "all")
                    .map((filter) => (
                      <option
                        key={filter.title + filter.type}
                        value={JSON.stringify({
                          title: filter.title,
                          type: filter.type,
                        })}
                      >
                        {filter.title.charAt(0).toUpperCase() +
                          filter.title.slice(1)}
                      </option>
                    ))}
                </select>
              </>
            )}

            {((isEditing && selectedFilter != "") || !isEditing) && (
              <div className="flex flex-col gap-1">
                {isEditing && (
                  <div
                    className="w-full relative mb-4
                    before:cotent-[''] before:absolute before:top-3 before:left-0 before:right-0 before:z-[-1] 
                    before:h-1 before:bg-slate-300"
                  >
                    <h3 className="relative inline pr-4 mb-2 font-semibold text-center bg-slate-50">
                      Editing {selectedFilter.title}
                    </h3>
                  </div>
                )}
                <div className="flex items-center gap-2 mb-4">
                  <label htmlFor="filterTitle" className="w-20">
                    Name
                  </label>
                  <input
                    className="w-full p-2 border-2 rounded-md"
                    name="filterTitle"
                    type="text"
                    value={filterName}
                    onChange={(e) => {
                      var text = e.target.value;
                      text = text.replace(/[^a-zA-Z0-9 ]/g, "");
                      text = text.toLowerCase();
                      setFilterName(text);
                    }}
                  />
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <label htmlFor="filterType" className="w-20">
                    Type
                  </label>
                  <Toggle
                    getter={filterType}
                    setter={setFilterType}
                    firstOption="Positive"
                    secondOption="Negative"
                    type="greenred"
                  />
                </div>

                {isEditing && (
                  <>
                    <button
                      className="w-full p-2 mb-4 text-white bg-red-600 rounded-md"
                      onClick={deleteFilter}
                    >
                      Delete
                    </button>

                    <button
                      className="w-full p-2 text-white capitalize rounded-md bg-slate-600"
                      onClick={editFilter}
                    >
                      Edit {selectedFilter.title}
                    </button>
                  </>
                )}

                {!isEditing && (
                  <button
                    className="w-full p-2 text-white capitalize rounded-md bg-slate-600"
                    onClick={addNewFilter}
                  >
                    Add new filter
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {auxInfo.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {auxInfo.map((info, index) => (
              <div className="text-xs text-red-600">
                {info}
                {index !== auxInfo.length - 1 && ", "}
              </div>
            ))}
          </div>
        )}
      </div>
      <div
        onClick={() => {
          closeModal();
        }}
        className={`duration-400 fixed z-40 top-0 left-0 w-full h-full bg-black bg-opacity-50 ${
          showEditFiltersModal ? "block opacity-100" : "opacity-0 hidden"
        }`}
      ></div>
    </>
  );
}
