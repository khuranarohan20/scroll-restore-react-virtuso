// @ts-nocheck

import { useCallback, useEffect, useRef, useState } from "react";
import { Virtuoso } from "react-virtuoso";

export default function App() {
  const [users, setUsers] = useState(() => []);
  const [loading, setLoading] = useState(false);

  const [align, setAlign] = useState("start");
  const [behavior, setBehavior] = useState("auto");
  const virtuoso = useRef(null);
  const scrollPosition = useRef(0);
  const [clicked, setClicked] = useState(false);

  const loadMore = useCallback(() => {
    const element = document.querySelector("[data-testid='virtuoso-scroller']");

    if (clicked && element) {
      const recursiveLoad = () => {
        console.log(
          "%cRunning...",
          "font-size:1.5rem; color:Red;",
          element.scrollTop
        );
        if (element.scrollTop >= 6125) {
          return;
        }

        setTimeout(() => {
          setUsers((users) => [...users, ...generateUsers(100, users.length)]);
          element.scrollTo({ top: element.scrollTop + 300 });
          recursiveLoad();
        }, 0);
      };

      setLoading(true);
      recursiveLoad();
      setLoading(false);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setUsers((users) => [...users, ...generateUsers(100, users.length)]);
      setLoading(false);
    }, 500);
  }, [clicked]);

  useEffect(() => {
    if (virtuoso.current) {
      virtuoso.current.scrollTo({ top: scrollPosition.current });
    }
  }, []);

  useEffect(() => {
    loadMore();
  }, []);

  return (
    <>
      <button
        style={{ whiteSpace: "nowrap" }}
        onClick={(e) => {
          e.preventDefault();
          setClicked(true);
          loadMore();
        }}
      >
        Go to 405
      </button>
      <Virtuoso
        style={{ height: 300 }}
        data={users}
        context={{ loading }}
        ref={virtuoso}
        increaseViewportBy={100}
        endReached={loadMore}
        itemContent={(index, user) => {
          return <div>{user.name}</div>;
        }}
        components={{ Footer }}
      />
    </>
  );
}

const Footer = ({ context: { loading } }) => {
  return (
    <div
      style={{
        padding: "2rem",
        display: "flex",
        justifyContent: "center",
      }}
    >
      {loading ? "Loading..." : "Scroll to load more"}
    </div>
  );
};

function generateUsers(count, start) {
  return Array.from({ length: count }, (_, i) => ({
    name: `User ${start + i}`,
  }));
}
