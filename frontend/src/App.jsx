import { useEffect, useState } from "react";
import axios from "axios";
import toast from"react-hot-toast";


const App = () => {
  const [message, setMessage] = useState("");
  const [data, setData] = useState([]);
  const [fetch, setFetch] = useState(false);

  const handleForm = async (e) => {
    e.preventDefault();
    if (!message) {
      alert("Please enter a message");
      return;
    }
    try {
      const res = await axios.post("http://localhost:8080/api/send", {
        message,
      });
      setMessage("");
      setData([...data, res.data.data]);
      setFetch(!fetch);
      toast.success(data.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = (id) => {
    axios
      .delete("http://localhost:8080/api/delete", { data: { id } })
      .then((data) => toast.success(data.data.message))
      .then(setFetch(!fetch));
  };

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/getAllMessages")
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => console.log(error));
  }, [fetch]);
  return (
    <div className="w-full h-screen bg-zinc-900 text-white flex justify-center items-center">
      <div className=" sm:w-1/2 lg:w-1/3 h-fit rounded-xl flex flex-col gap-2 p-2">
        <form
          className="w-full h-fit flex flex-col gap-3 justify-center items-center p-4 bg-zinc-800 rounded-xl"
          onSubmit={handleForm}
        >
          <h1 className="text-5xl text-purple-500 font-semibold">
            Submit Form
          </h1>
          <input
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            className="p-4 rounded-full w-full text-black"
            type="text"
            name="message"
            value={message}
            placeholder="message"
          />
          <button className="w-fit bg-green-500 hover:bg-green-600 px-6 py-2 rounded-full text-2xl">
            send
          </button>
        </form>
        <div className="w-full bg-zinc-800 flex flex-col gap-2 p-2 rounded-xl">
          {data &&
            data.map((data,index) => {
              return (
                <div
                  key={index}
                  className="w-full bg-zinc-700 p-2 rounded-md flex justify-between items-center"
                >
                  <h1 className="text-xl">{data.message}</h1>

                  <button
                    onClick={() => handleDelete(data._id)}
                    className="bg-red-500 hover:bg-red-600 rounded-full px-4 py-2"
                  >
                    Delete
                  </button>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default App;
