import { Provider } from "react-redux";
import { store } from "../store";

const withStore = (component: () => React.ReactNode) => () =>
  <Provider store={store}>{component()}</Provider>;

export default withStore;
