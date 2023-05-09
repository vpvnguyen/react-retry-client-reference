/* eslint-disable no-unused-vars */
import React from "react";
import axios from "axios";

//

import {
  useQuery,
  useQueryClient,
  useMutation,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

export default function AutoRefetching() {
  return (
    <QueryClientProvider client={queryClient}>
      <Example />
    </QueryClientProvider>
  );
}

function Example() {
  const queryClient = useQueryClient();
  const [intervalMs, setIntervalMs] = React.useState(1000);
  const [value, setValue] = React.useState("");
  const [counter, setCounter] = React.useState(0);

  const {
    status,
    data: people,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["people"],
    queryFn: async () => {
      const {
        data: { results },
      } = await axios.get("https://swapi.dev/api/people");
      setCounter(counter + 1);
      return results;
    },
    // Refetch the data every second
    refetchInterval: intervalMs,
  });

  const { data: planets } = useQuery({
    queryKey: ["planets"],
    queryFn: async () => {
      const {
        data: { results },
      } = await axios.get("https://swapi.dev/api/planets");
      return results;
    },
    // Refetch the data every second
    enabled: counter > 10,
  });

  const { data: starships } = useQuery({
    queryKey: ["starships"],
    queryFn: async () => {
      try {
        const {
          data: { results },
        } = await axios.get("https://swapi.dev/api/starshipss");
        return results;
      } catch (error) {
        return planets
      }
    },
    // Refetch the data every second
    enabled: planets?.length > 0,
  });

  const clearMutation = useMutation({
    mutationFn: () => fetch(`https://swapi.dev/api/starships`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  if (status === "loading") return <h1>Loading...</h1>;
  if (status === "error") return <span>Error: {error.message}</span>;

  return (
    <div
      style={{
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1>Auto Refetch with stale-time set to {`${intervalMs / 1000}`}s</h1>
      <label>
        Query Interval speed (ms): <p>Counter: {`${counter}`}</p>
        <input
          value={intervalMs}
          onChange={(ev) => setIntervalMs(Number(ev.target.value))}
          type="number"
          step="100"
        />{" "}
        <span
          style={{
            display: "inline-block",
            marginLeft: ".5rem",
            width: 10,
            height: 10,
            background: isFetching ? "green" : "transparent",
            transition: !isFetching ? "all .3s ease" : "none",
            borderRadius: "100%",
            transform: "scale(2)",
          }}
        />
      </label>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          color: isFetching ? "green" : "white",
          transition: !isFetching ? "all .3s ease" : "none",
        }}
      >
        <div>
          <ul>
            {people && people?.map(({ name }) => <li key={name}>{name}</li>)}
          </ul>
        </div>
        <div>
          <ul>
            {planets && planets?.map(({ name }) => <li key={name}>{name}</li>)}
          </ul>
        </div>
        <div>
          <ul>
            {starships && starships?.map(({ name }) => <li key={name}>{name}</li>)}
          </ul>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          onClick={() => {
            setCounter(Number(0));
          }}
        >
          Clear All
        </button>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </div>
  );
}
