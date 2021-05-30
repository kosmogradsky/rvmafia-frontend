import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import * as React from "react";

export interface LoadedUser {
  type: "LoadedUser";
  user: User;
}

export interface LoadingUser {
  type: "LoadingUser";
}

export interface WithoutUser {
  type: "WithoutUser";
}

export type UserLoadingState = LoadedUser | LoadingUser | WithoutUser;

export function useUserLoadingState(): UserLoadingState {
  const [user, setUser] = React.useState<UserLoadingState>({
    type: "LoadingUser",
  });

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        setUser({
          type: "LoadedUser",
          user,
        });
      } else {
        setUser({
          type: "WithoutUser",
        });
      }
    });

    return unsubscribe;
  }, []);

  return user;
}
