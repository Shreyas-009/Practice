import { useEffect, useState } from "react";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

const App = () => {
  const [message, setMessage] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [data, setData] = useState([]);
  const [fetch, setFetch] = useState(false);
  const [update, setUpdate] = useState("");

  const handleForm = async (e) => {
    e.preventDefault();
    if (!message) {
      toast.success("Please enter a message");
      return;
    }
    try {
      const res = await axios.post("http://localhost:8080/api/send", {
        message,
      });
      setMessage("");
      setFetch(!fetch);
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    const res = await axios.delete("http://localhost:8080/api/delete", {
      data: { id },
    });
    setFetch(!fetch);
    toast.success(res.data.message);
  };

  const handleUpdate = async (id) => {
    if(!newMessage){
      toast.success("Please Enter the message")
      return;
    }
    try {
      await axios.put("http://localhost:8080/api/update", { id, newMessage });
      setUpdate(!update);
      setFetch(!fetch);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/messages")
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => console.log(error));
  }, [fetch]);
  return (
    <div className="w-full h-screen bg-zinc-900 text-white flex justify-center items-center">
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <div className="w-full sm:w-1/2 lg:w-1/3 h-fit rounded-xl flex flex-col gap-2 p-2">
        <form
          className="w-full h-fit flex flex-col gap-3 justify-center items-center p-4 bg-zinc-800 rounded-xl"
          onSubmit={handleForm}
        >
          <h1 className="text-4xl lg:text-5xl text-purple-500 font-semibold">
            Submit Form
          </h1>
          <hr className="bg-zinc-200 w-full my-2" />
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
          {data.length != 0 ? (
            data.map((data, index) => {
              return (
                <div
                  key={index}
                  className="w-full bg-zinc-700 p-2 rounded-md flex justify-between items-center"
                >
                  {update == data._id ? (
                    <>
                      <div className="flex gap-2">
                        <input
                          onChange={(e) => {
                            setNewMessage(e.target.value);
                          }}
                          className="p-2 rounded-full w-full text-black"
                          type="text"
                          name="update message"
                          value={newMessage}
                          placeholder="update message"
                        />

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdate(data._id)}
                            className="bg-yellow-500 hover:bg-yellow-600 rounded-full px-4 py-2"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => setUpdate(false)}
                            className="bg-green-500 hover:bg-green-600 rounded-full px-4 py-2"
                          >
                            Cancle
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <h1 className="text-xl">{data.message}</h1>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {setUpdate(data._id); setNewMessage(data.message)}}
                          className="bg-yellow-500 hover:bg-yellow-600 rounded-full px-4 py-2"
                        >
                          🖋️
                        </button>
                        <button
                          onClick={() => handleDelete(data._id)}
                          className="bg-red-500 hover:bg-red-600 rounded-full px-4 py-2"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })
          ) : (
            <h1 className="text-3xl text-center text-white">No Data</h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
