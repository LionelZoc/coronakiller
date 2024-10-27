import { persistor } from "state/redux/configureStore";
// todo cyclical dependance here. remove it
// Function to clear the persisted Redux store
export const clearPersistedStore = () => {
  persistor
    .purge()
    .then(() => {
      console.log("Persisted data purged!");
    })
    .catch((error) => {
      console.error("Failed to purge persisted store:", error);
    });
};
