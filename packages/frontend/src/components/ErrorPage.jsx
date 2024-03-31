export default function ErrorPage({ error }) {
  return (
    <div className="container">
      <div className="row justify-content-start">
        <div className="col-12">
          <h2 className="h3">Oops!</h2>
          <p>Sorry, an unexpected error has occurred.</p>
          <p>
            <i>{error.message}</i>
          </p>
        </div>
      </div>
    </div>
  );
}
