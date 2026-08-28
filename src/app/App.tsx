import Main from "../imports/Main/Main";
import AccessGuard from "../components/AccessGuard";

export default function App() {
  return (
    <AccessGuard>
      <div className="size-full overflow-hidden">
        <Main />
      </div>
    </AccessGuard>
  );
}