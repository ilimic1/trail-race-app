import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMe,
  login as loginMutationFn,
  logout as logoutMutationFn,
} from "../api";
import { useLocalStorageToken } from "./useLocalStorageToken";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useLocalStorageToken(null);
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: () => getMe(),
  });

  const { mutate: loginMutation } = useMutation({
    mutationFn: (data) => loginMutationFn(data),
  });

  const { mutate: logoutMutation } = useMutation({
    mutationFn: () => logoutMutationFn(),
  });

  const login = async (email, password) => {
    loginMutation(
      { email, password },
      {
        onSuccess: (data) => {
          setToken(data.access_token);
          queryClient.invalidateQueries("me");
          navigate("/");
        },
      },
    );
  };

  const logout = () => {
    logoutMutation(undefined, {
      onSuccess: () => {
        setToken(null);
        queryClient.invalidateQueries("me");
        // navigate("/login", { replace: true });
        window.location.pathname = "/login";
      },
    });
  };

  const value = useMemo(
    () => ({
      token,
      user,
      login,
      logout,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
