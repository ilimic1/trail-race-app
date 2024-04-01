import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  // TODO: Implement better error page.

  return (
    <div className="container">
      <div className="row justify-content-start">
        <div className="col-5">
          <h2 className="h3">Oops!</h2>
          <p>Sorry, an unexpected error has occurred.</p>
          <p>
            <i>{error.statusText || error.message}</i>
          </p>
        </div>
      </div>
    </div>
  );
}
