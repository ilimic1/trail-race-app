import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import Button from "react-bootstrap/Button";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  createApplication,
  createRace,
  deleteApplication,
  deleteRace,
  getRace,
  getRaces,
  listApplications,
  updateRace,
} from "../api";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";

const racesListQuery = () =>
  queryOptions({
    queryKey: ["races", "list", "all"],
    queryFn: () => {
      return getRaces();
    },
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

const useRaces = () => {
  return useQuery(racesListQuery());
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
  const {
    data: applications,
    isLoading: isLoadingApplications,
    isError: isErrorApplications,
  } = useApplications({ user_id: user.id });
  const {
    data: races,
    isLoading: isLoadingRaces,
    isError: isErrorRaces,
  } = useRaces();
  const deleteRace = useDeleteRace();

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this race?")) {
      deleteRace.mutate({ id });
    }
  };

  if (isLoadingApplications || isLoadingRaces) {
    return <div>Loading...</div>;
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
                <th scope="col">Name</th>
                <th scope="col">Distance</th>
                <th scope="col">Created</th>
                <th scope="col" className="text-center w-25">
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
                            <Link
                              className="btn btn-primary btn-sm"
                              to={`/races/${race.id}/update`}
                            >
                              Update
                            </Link>{" "}
                            <Button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleDelete(race.id)}
                            >
                              Delete
                            </Button>
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
        </div>
      </div>
    </div>
  );
}

export function ViewRace() {
  const { id } = useParams();
  const { data: race, isLoading, isError } = useRace({ id });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error.</div>;
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
    // formState: { errors },
  } = useForm({
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
                className="form-control"
                id="name"
                {...register("name", { required: true })}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="distance" className="form-label">
                Distance
              </label>
              <select
                className="form-select"
                id="distance"
                aria-label="Distance"
                {...register("distance", { required: true })}
              >
                <option value="5k">5k</option>
                <option value="10k">10k</option>
                <option value="HalfMarathon">HalfMarathon</option>
                <option value="Marathon">Marathon</option>
              </select>
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
    // formState: { errors },
  } = useForm({
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
    return <div>Loading...</div>;
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
                className="form-control"
                id="name"
                {...register("name", { required: true })}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="distance" className="form-label">
                Distance
              </label>
              <select
                className="form-select"
                id="distance"
                aria-label="Distance"
                {...register("distance", { required: true })}
              >
                <option value="5k">5k</option>
                <option value="10k">10k</option>
                <option value="HalfMarathon">HalfMarathon</option>
                <option value="Marathon">Marathon</option>
              </select>
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
    // formState: { errors },
  } = useForm({
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
    return <div>Loading...</div>;
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
                className="form-control"
                id="first_name"
                {...register("first_name", { required: true, max: 255 })}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="last_name" className="form-label">
                Last Name
              </label>
              <input
                className="form-control"
                id="last_name"
                {...register("last_name", { required: true, max: 255 })}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="club" className="form-label">
                Club
              </label>
              <input
                className="form-control"
                id="club"
                {...register("club", { required: false, max: 255 })}
              />
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
    return <div>Loading...</div>;
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
