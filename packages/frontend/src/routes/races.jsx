import { zodResolver } from "@hookform/resolvers/zod";
import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import clsx from "clsx";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import {
  createApplication,
  createRace,
  deleteApplication,
  deletePermanentlyRace,
  deleteRace,
  getRace,
  getRaces,
  listApplications,
  restoreRace,
  updateRace,
} from "../api";
import ErrorPage from "../components/ErrorPage";
import LoaderPage from "../components/LoaderPage";
import { useAuth } from "../hooks/useAuth";

const createRaceSchema = z.object({
  name: z
    .string()
    .min(1, "Name must be at least 1 character")
    .max(255, "Name must be at most 255 characters"),
  distance: z.enum(["5k", "10k", "HalfMarathon", "Marathon"]),
});
const updateRaceSchema = createRaceSchema;

const applyForRaceSchema = z.object({
  first_name: z
    .string()
    .min(1, "First name must be at least 1 character")
    .max(255, "First name must be at most 255 characters"),
  last_name: z
    .string()
    .min(1, "Last name must be at least 1 character")
    .max(255, "Last name must be at most 255 characters"),
  club: z
    .string()
    .max(255, "Club must be at most 255 characters")
    .optional(),
});

const racesListQuery = ({ page }) =>
  queryOptions({
    queryKey: ["races", "list", page],
    queryFn: () => {
      return getRaces({ page });
    },
    placeholderData: keepPreviousData,
  });

const raceQuery = ({ id }) =>
  queryOptions({
    queryKey: ["races", "detail", id],
    queryFn: () => {
      return getRace({ id });
    },
  });

const listApplicationsQuery = (data) =>
  queryOptions({
    queryKey: ["applications", "list", data],
    queryFn: () => {
      return listApplications(data);
    },
  });

const useRaces = ({ page }) => {
  const { data, ...rest } = useQuery(racesListQuery({ page }));
  console.log("data", data);
  return { ...rest, data: data?.data, hasMore: !!data?.next_page_url };
};

const useRace = ({ id }) => {
  return useQuery(raceQuery({ id }));
};

const useCreateRace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => createRace(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["races"] });
    },
  });
};

const useUpdateRace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => updateRace(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["races"] });
    },
  });
};

const useDeleteRace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => deleteRace(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["races"] });
    },
  });
};

const useRestoreRace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => restoreRace(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["races"] });
    },
  });
};

const useDeletePermanentlyRace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => deletePermanentlyRace(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["races"] });
    },
  });
};

const useApplications = (data) => {
  return useQuery(listApplicationsQuery(data));
};

const useCreateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => createApplication(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
};

const useDeleteApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => deleteApplication(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
};

// export const racesLoader = (queryClient) => async () => {
//   return await queryClient.ensureQueryData(racesListQuery());
// };

// export const raceLoader =
//   (queryClient) =>
//   async ({ params }) => {
//     if (!params.id) {
//       throw new Error("ID not provided");
//     }
//     return await queryClient.ensureQueryData(raceQuery({ id: params.id }));
//   };

// export const updateRaceLoader =
//   (queryClient) =>
//   async ({ params }) => {
//     if (!params.id) {
//       throw new Error("ID not provided");
//     }
//     return await queryClient.ensureQueryData(raceQuery({ id: params.id }));
//   };

export function ListRaces() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { search } = useLocation();
  const page = parseInt(new URLSearchParams(search).get("page")) || 1;
  const {
    data: applications,
    isLoading: isLoadingApplications,
    isError: isErrorApplications,
  } = useApplications({ user_id: user.id });
  // const [page, setPage] = useState(1);
  const {
    data: races,
    isLoading: isLoadingRaces,
    isError: isErrorRaces,
    isPlaceholderData: isPlaceholderDataRaces,
    hasMore: hasMoreRaces,
  } = useRaces({ page });
  console.log("races", races);
  const deleteRace = useDeleteRace();
  const restoreRace = useRestoreRace();
  const deletePermanentlyRace = useDeletePermanentlyRace();

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this race?")) {
      deleteRace.mutate({ id });
    }
  };

  const handleRestore = async (id) => {
    if (confirm("Are you sure you want to restore this race?")) {
      restoreRace.mutate({ id });
    }
  };

  const handleDeletePermanently = async (id) => {
    if (confirm("Are you sure you want to permanently delete this race?")) {
      deletePermanentlyRace.mutate({ id });
    }
  };

  if (isLoadingApplications || isLoadingRaces) {
    return <LoaderPage />;
  }

  if (isErrorApplications || isErrorRaces) {
    return <div>Error.</div>;
  }

  return (
    <div className="container">
      <div className="row justify-content-start">
        <div className="col-12">
          <h2 className="h3">Races</h2>
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th scope="col" style={{ width: "25%" }}>
                  Name
                </th>
                <th scope="col" style={{ width: "25%" }}>
                  Distance
                </th>
                <th scope="col" style={{ width: "25%" }}>
                  Created
                </th>
                <th
                  scope="col"
                  className="text-center"
                  style={{ width: "25%" }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {races.length ? (
                races.map((race) => {
                  const hasApplied = !!applications.find(
                    (application) => application.race_id === race.id,
                  );
                  return (
                    <tr key={race.id}>
                      <td>{race.name}</td>
                      <td>{race.distance}</td>
                      <td>{race.created_at}</td>
                      <td className="text-center w-25">
                        {user.role === "administrator" && (
                          <>
                            <Link
                              className="btn btn-primary btn-sm"
                              to={`/races/${race.id}`}
                            >
                              View
                            </Link>{" "}
                            {!race.deleted_at && (
                              <Link
                                className="btn btn-primary btn-sm"
                                to={`/races/${race.id}/update`}
                              >
                                Update
                              </Link>
                            )}{" "}
                            {!race.deleted_at && (
                              <Button
                                className="btn btn-primary btn-sm"
                                onClick={() => handleDelete(race.id)}
                              >
                                Delete
                              </Button>
                            )}{" "}
                            {race.deleted_at && (
                              <Button
                                className="btn btn-primary btn-sm"
                                onClick={() => handleRestore(race.id)}
                              >
                                Restore
                              </Button>
                            )}{" "}
                            {race.deleted_at && (
                              <Button
                                className="btn btn-primary btn-sm"
                                onClick={() => handleDeletePermanently(race.id)}
                              >
                                Delete Permanently
                              </Button>
                            )}
                          </>
                        )}
                        {user.role === "applicant" &&
                          (!hasApplied ? (
                            <Link
                              className="btn btn-primary btn-sm"
                              to={`/races/${race.id}/apply`}
                            >
                              Apply
                            </Link>
                          ) : (
                            <Button className="btn btn-primary btn-sm" disabled>
                              Apply
                            </Button>
                          ))}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="text-center" colSpan="4">
                    No races found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-center">
              <li className={clsx("page-item", { disabled: page === 1 })}>
                <button
                  onClick={() => {
                    navigate(`?page=${Math.max(page - 1, 1)}`);
                  }}
                  disabled={page === 1}
                  className="page-link"
                >
                  Previous
                </button>
              </li>
              <li className={clsx("page-item", { disabled: !hasMoreRaces })}>
                <button
                  // onClick={() => {
                  //   if (!isPlaceholderDataRaces && hasMoreRaces) {
                  //     setPage((prev) => prev + 1);
                  //   }
                  // }}
                  onClick={() => {
                    if (!isPlaceholderDataRaces && hasMoreRaces) {
                      navigate(`?page=${page + 1}`);
                    }
                  }}
                  disabled={isPlaceholderDataRaces || !hasMoreRaces}
                  className="page-link"
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}

export function ViewRace() {
  const { id } = useParams();
  const { data: race, isLoading, isError, error } = useRace({ id });

  if (isLoading) {
    return <LoaderPage />;
  }

  if (isError) {
    return <ErrorPage error={error} />;
  }

  return (
    <div className="container">
      <div className="row justify-content-start">
        <div className="col-5">
          <h2 className="h3">Race: {race.name}</h2>
          <table className="table">
            <tbody>
              <tr>
                <td>ID</td>
                <td>{race.id}</td>
              </tr>
              <tr>
                <td>Name</td>
                <td>{race.name}</td>
              </tr>
              <tr>
                <td>Distance</td>
                <td>{race.distance}</td>
              </tr>
              <tr>
                <td>Created</td>
                <td>{race.created_at}</td>
              </tr>
              <tr>
                <td>Updated</td>
                <td>{race.updated_at}</td>
              </tr>
              <tr>
                <td>Deleted</td>
                <td>{race.deleted_at}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function CreateRace() {
  const createRace = useCreateRace();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createRaceSchema),
    defaultValues: {
      name: "",
      distance: "",
    },
  });

  const onSubmit = (data) => {
    createRace.mutate(data, {
      onSuccess: () => {
        navigate("/");
      },
    });
  };

  return (
    <div className="container">
      <div className="row justify-content-start">
        <div className="col-5">
          <h2 className="h3">Create New Race</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                className={clsx("form-control", { "is-invalid": errors.name })}
                id="name"
                {...register("name")}
                data-1p-ignore
              />
              {errors.name && (
                <div className="invalid-feedback">{errors.name.message}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="distance" className="form-label">
                Distance
              </label>
              <select
                className={clsx("form-control", {
                  "is-invalid": errors.distance,
                })}
                id="distance"
                aria-label="Distance"
                {...register("distance")}
              >
                <option value="5k">5k</option>
                <option value="10k">10k</option>
                <option value="HalfMarathon">HalfMarathon</option>
                <option value="Marathon">Marathon</option>
              </select>
              {errors.distance && (
                <div className="invalid-feedback">
                  {errors.distance.message}
                </div>
              )}
            </div>
            <button type="submit" className="btn btn-primary">
              Create New Race
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export function UpdateRace() {
  const { id } = useParams();
  const { data: race, isLoading, isError } = useRace({ id });
  const updateRace = useUpdateRace();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateRaceSchema),
    defaultValues: {
      name: race ? race.name : "",
      distance: race ? race.distance : "",
    },
  });

  useEffect(() => {
    reset({
      name: race ? race.name : "",
      distance: race ? race.distance : "",
    });
  }, [race]);

  const onSubmit = (data) => {
    updateRace.mutate(
      { id, ...data },
      {
        onSuccess: () => {
          navigate("/");
        },
      },
    );
  };

  if (isLoading) {
    return <LoaderPage />;
  }

  if (isError) {
    return <div>Error.</div>;
  }

  return (
    <div className="container">
      <div className="row justify-content-start">
        <div className="col-5">
          <h2 className="h3">Update Race: {race.name}</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                className={clsx("form-control", { "is-invalid": errors.name })}
                id="name"
                {...register("name")}
                data-1p-ignore
              />
              {errors.name && (
                <div className="invalid-feedback">{errors.name.message}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="distance" className="form-label">
                Distance
              </label>
              <select
                className={clsx("form-control", {
                  "is-invalid": errors.distance,
                })}
                id="distance"
                aria-label="Distance"
                {...register("distance")}
              >
                <option value="5k">5k</option>
                <option value="10k">10k</option>
                <option value="HalfMarathon">HalfMarathon</option>
                <option value="Marathon">Marathon</option>
              </select>
              {errors.distance && (
                <div className="invalid-feedback">
                  {errors.distance.message}
                </div>
              )}
            </div>
            <button type="submit" className="btn btn-primary">
              Update Race
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export function CreateApplication() {
  const { id } = useParams();
  const { user } = useAuth();
  const { data: race, isLoading, isError } = useRace({ id });
  const createApplication = useCreateApplication();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(applyForRaceSchema),
    defaultValues: {
      first_name: user.first_name,
      last_name: user.last_name,
      club: "",
    },
  });

  const onSubmit = (data) => {
    createApplication.mutate(
      { user_id: user.id, race_id: id, ...data },
      {
        onSuccess: () => {
          navigate("/applications");
        },
      },
    );
  };

  if (isLoading) {
    return <LoaderPage />;
  }

  if (isError) {
    return <div>Error.</div>;
  }

  return (
    <div className="container">
      <div className="row justify-content-start">
        <div className="col-5">
          <h2 className="h3">Apply for Race: {race.name}</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label htmlFor="first_name" className="form-label">
                First Name
              </label>
              <input
                className={clsx("form-control", { "is-invalid": errors.first_name })}
                id="first_name"
                {...register("first_name")}
              />
              {errors.first_name && (
                <div className="invalid-feedback">{errors.first_name.message}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="last_name" className="form-label">
                Last Name
              </label>
              <input
                className={clsx("form-control", { "is-invalid": errors.last_name })}
                id="last_name"
                {...register("last_name")}
              />
              {errors.last_name && (
                <div className="invalid-feedback">{errors.last_name.message}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="club" className="form-label">
                Club
              </label>
              <input
                className={clsx("form-control", { "is-invalid": errors.club })}
                id="club"
                {...register("club")}
              />
              {errors.club && (
                <div className="invalid-feedback">{errors.club.message}</div>
              )}
            </div>
            <button type="submit" className="btn btn-primary">
              Apply for Race
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export function ListApplications() {
  const { user } = useAuth();
  const {
    data: applications,
    isLoading,
    isError,
  } = useApplications({ user_id: user.id });
  const deleteApplication = useDeleteApplication();

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this application?")) {
      deleteApplication.mutate({ id });
    }
  };

  if (isLoading) {
    return <LoaderPage />;
  }

  if (isError) {
    return <div>Error.</div>;
  }

  return (
    <div className="container">
      <div className="row justify-content-start">
        <div className="col-12">
          <h2 className="h3">My Applications</h2>
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th scope="col">Race</th>
                <th scope="col">Applicant</th>
                <th scope="col">Club</th>
                <th scope="col">Created</th>
                <th scope="col" className="text-center w-25">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {applications.length ? (
                applications.map((application) => (
                  <tr key={application.id}>
                    <td>{application.race.name}</td>
                    <td>
                      {application.first_name} {application.last_name}
                    </td>
                    <td>{application.club}</td>
                    <td>{application.created_at}</td>
                    <td className="text-center w-25">
                      <Button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleDelete(application.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="text-center" colSpan="5">
                    No applications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
