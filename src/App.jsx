import { StaticRoutes } from "./router";
import { Suspense } from "react";
import Loading from "./components/Loading";
import AuthRouter from "./router/authRouter";


function App() {
  const elements = StaticRoutes();
  return (
    <>
      <Suspense fallback={<Loading />}>
        <AuthRouter>{elements}</AuthRouter>
      </Suspense>
    </>
  );
}

export default App;
