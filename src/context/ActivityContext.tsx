import { createContext, Dispatch, ReactNode, useMemo, useReducer } from "react";
import {
  ActivityActions,
  activityReducer,
  ActivityState,
  initialState,
} from "../reducers/activity-reducer";
import { Activity } from "../types";
import { categories } from "../data/categories";

type ActivityProviderProps = {
  children: ReactNode;
};

type ActivityContextProps = {
  state: ActivityState
  dispatch: Dispatch<ActivityActions>
  caloriesConsumed: number
  caloriesBurned: number
  netCalories: number
  categoryName: (category: Activity["category"]) => string[]
  isEmptyActivities: boolean
};

export const ActivityContext = createContext<ActivityContextProps>(null!);

export const ActivityProvider = ({ children }: ActivityProviderProps) => {
  const [state, dispatch] = useReducer(activityReducer, initialState);

  // Contadores
  const { caloriesConsumed, caloriesBurned, netCalories } = useMemo(() => {
    const caloriesConsumed = state.activities.reduce(
      (total: number, activity: Activity): number =>
        activity.category === 1 ? total + activity.calories : total,
      0
    );

    const caloriesBurned = state.activities.reduce(
      (total: number, activity: Activity): number =>
        activity.category === 2 ? total + activity.calories : total,
      0
    );

    const netCalories = caloriesConsumed - caloriesBurned;

    return {
      caloriesConsumed,
      caloriesBurned,
      netCalories,
    };
  }, [state.activities]);

  const categoryName = useMemo(
    () => (category: Activity["category"]) =>
      categories.map((cat) => (cat.id === category ? cat.name : "")),
    []
  );

  const isEmptyActivities = useMemo(
    () => state.activities.length === 0,
    [state.activities]
  );


  return (
    <ActivityContext.Provider
      value={{
        state,
        dispatch,
        caloriesConsumed,
        caloriesBurned,
        netCalories,
        categoryName,
        isEmptyActivities
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};
