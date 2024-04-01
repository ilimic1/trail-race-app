import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createContext, useContext, useMemo } from "react";
import {
  getMe,
  login as loginMutationFn,
  logout as logoutMutationFn,
} from "../api";
import { useLocalStorageToken } from "./useLocalStorageToken";

const AuthContext = createContext();

const meQuery = () =>
  queryOptions({
    queryKey: ["me"],
    queryFn: () => getMe(),
  });

export const meLoader = (queryClient) => async () => {
  try {
    // ensure the "me" query is in the cache before we render the app
    await queryClient.ensureQueryData(meQuery());
  } catch (error) {
    // noop
  }
  return null;
};

export const AuthProvider = ({ children }) => {
  console.log("AuthProvider");

  const [token, setToken] = useLocalStorageToken(null);
  const queryClient = useQueryClient();

  const { data: user } = useQuery(meQuery());

  const login = useMutation({
    mutationFn: (data) => loginMutationFn(data),
    onSuccess: (data) => {
      setToken(data.access_token);
      queryClient.removeQueries({ queryKey: ["me"], exact: true });
    },
  });

  const logout = useMutation({
    mutationFn: () => logoutMutationFn(),
    onSuccess: () => {
      setToken(null);
      queryClient.removeQueries();
    },
  });

  const value = useMemo(
    () => ({
      login,
      logout,
      token,
      user,
    }),
    [login, logout, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
