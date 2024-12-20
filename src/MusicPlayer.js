import React, { useState, useEffect } from "react";
import {
  FaPlay,
  FaPause,
  FaStepBackward,
  FaStepForward,
  FaUpload,
  FaRandom,
} from "react-icons/fa";

const MusicPlayer = () => {
  const [songs, setSongs] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    fetch("https://saregamabackend.onrender.com/songs")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch songs");
        return res.json();
      })
      .then((data) => setSongs(data))
      .catch((error) => console.error("Error fetching songs:", error));
  }, []);

  const updateTime = () => {
    setCurrentTime(audio?.currentTime || 0);
  };

  const playSong = (index) => {
    const selectedSong = songs[index];
    setCurrentSongIndex(index);

    const songUrl =
      selectedSong.url ||
      `https://saregama.s3.amazonaws.com/${selectedSong._id}`;
    const newAudio = new Audio(songUrl);

    if (audio) audio.pause();
    newAudio
      .play()
      .catch((error) => console.error("Error playing song:", error));

    setAudio(newAudio);
    setIsPlaying(true);
    setCurrentTime(0);
  };

  const togglePlayPause = () => {
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio
        .play()
        .catch((error) => console.error("Error playing audio:", error));
    }
    setIsPlaying(!isPlaying);
  };

  const prevSong = () => {
    const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    playSong(prevIndex);
  };

  const nextSong = () => {
    const nextIndex = (currentSongIndex + 1) % songs.length;
    playSong(nextIndex);
  };

  const handleSongEnd = () => {
    nextSong();
  };

  useEffect(() => {
    if (audio) {
      audio.addEventListener("timeupdate", updateTime);
      audio.addEventListener("ended", handleSongEnd);
      audio.addEventListener("loadedmetadata", () => {
        setDuration(audio.duration); // Set duration once metadata is loaded
      });
  
      // Cleanup listeners
      return () => {
        audio.removeEventListener("timeupdate", updateTime);
        audio.removeEventListener("ended", handleSongEnd);
        audio.removeEventListener("loadedmetadata", () => {
          setDuration(audio.duration);
        });
      };
    }
  }, [audio]);
  
  const handleProgressChange = (e) => {
    if (!audio || !duration || isNaN(duration)) {
      console.error("Duration is not valid");
      return;
    }
    const seekTime = (e.target.value / 100) * duration;
    audio.currentTime = seekTime; // Update audio's current time
    setCurrentTime(seekTime); // Update progress state
  };
  
  const formatTime = (time) => {
    if (isNaN(time) || time === undefined) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };
  

  const shuffleSongs = () => {
    if (songs.length === 0) {
      console.error("No songs to shuffle");
      return;
    }
    const randomIndex = Math.floor(Math.random() * songs.length);
    playSong(randomIndex);
  };

  const uploadSong = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", file.name);

    await fetch("https://saregamabackend.onrender.com/upload", {
      method: "POST",
      body: formData,
    });

    const updatedSongs = await fetch(
      "https://saregamabackend.onrender.com/songs"
    ).then((res) => res.json());
    setSongs(updatedSongs);
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <div className="flex flex-col items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-md shadow-lg rounded-lg m-4">
        <h1 className="text-2xl w-[80%] font-bold">
          {songs[currentSongIndex]?.name || "Select a Song"}
        </h1>
  
        {/* Progress Bar and Controllers Container */}
        <div className="mt-4 w-[80%] bg-gray-800 p-4 rounded-md shadow-md">
          <div className="flex flex-col items-center">
            {/* Progress Bar */}
            <input
              type="range"
              className="w-full appearance-none bg-gray-700 rounded-lg cursor-pointer accent-red-600 hover:accent-red-400 focus:outline-none"
              value={(currentTime / duration) * 100 || 0}
              onChange={handleProgressChange}
            />
            <div className="flex justify-between text-sm mt-2 w-full">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
  
          {/* Controllers */}
          <div className="flex justify-center gap-4 mt-4">
            <button
              className="p-4 rounded-full bg-gray-800 hover:bg-gray-700 transition"
              onClick={prevSong}
            >
              <FaStepBackward />
            </button>
            <button
              className="p-4 rounded-full bg-gray-800 hover:bg-gray-700 transition"
              onClick={togglePlayPause}
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <button
              className="p-4 rounded-full bg-gray-800 hover:bg-gray-700 transition"
              onClick={nextSong}
            >
              <FaStepForward />
            </button>
          </div>
        </div>
  
        <div className="mt-4">
          <label className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-md cursor-pointer hover:bg-gray-700">
            <FaUpload />
            <span>Upload Song</span>
            <input type="file" onChange={uploadSong} className="hidden" />
          </label>
        </div>
      </div>
  
      <div className="mx-4 mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Playlist</h2>
          <button
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-md transition"
            onClick={shuffleSongs}
          >
            <FaRandom />
          </button>
        </div>
      </div>
  
      <div
        className="flex-1 overflow-y-auto bg-gray-900 p-4 rounded-lg mx-4"
        style={{ height: "50%" }}
      >
        <div className="space-y-2">
          {songs.map((song, index) => (
            <div
              key={song._id}
              className={`p-2 rounded-md text-center cursor-pointer ${
                index === currentSongIndex
                  ? "bg-gray-700 font-bold"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
              onClick={() => playSong(index)}
            >
              {song.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
};

export default MusicPlayer;

// import React, { useState, useEffect } from 'react';
// import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaUpload, FaRandom } from 'react-icons/fa';

// const MusicPlayer = () => {
//     const [songs, setSongs] = useState([]);
//     const [currentSongIndex, setCurrentSongIndex] = useState(0);
//     const [audio, setAudio] = useState(null);
//     const [isPlaying, setIsPlaying] = useState(false);

//     useEffect(() => {
//         fetch('https://saregamabackend.onrender.com/songs')
//             .then((res) => {
//                 if (!res.ok) throw new Error('Failed to fetch songs');
//                 return res.json();
//             })
//             .then((data) => setSongs(data))
//             .catch((error) => console.error('Error fetching songs:', error));
//     }, []);

//     useEffect(() => {
//         if (audio) {
//             audio.addEventListener('ended', handleSongEnd);
//         }
//         return () => {
//             if (audio) audio.removeEventListener('ended', handleSongEnd);
//         };
//     }, [audio]);

//     const playSong = (index) => {
//         const selectedSong = songs[index];
//         setCurrentSongIndex(index);

//         const songUrl = selectedSong.url || `https://saregama.s3.amazonaws.com/${selectedSong._id}`;
//         const newAudio = new Audio(songUrl);

//         if (audio) audio.pause();
//         newAudio.play().catch((error) => console.error('Error playing song:', error));

//         setAudio(newAudio);
//         setIsPlaying(true);
//     };

//     const handleSongEnd = () => {
//         nextSong();
//     };

//     const togglePlayPause = () => {
//         if (!audio) {
//             console.error('No audio to play');
//             return;
//         }
//         if (isPlaying) {
//             audio.pause();
//             setIsPlaying(false);
//         } else {
//             audio.play().catch((error) => console.error('Error playing audio:', error));
//             setIsPlaying(true);
//         }
//     };

//     const prevSong = () => {
//         const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
//         playSong(prevIndex);
//     };

//     const nextSong = () => {
//         const nextIndex = (currentSongIndex + 1) % songs.length;
//         playSong(nextIndex);
//     };

//     const shuffleSongs = () => {
//         const randomIndex = Math.floor(Math.random() * songs.length);
//         playSong(randomIndex);
//     };

//     // const uploadSong = async (e) => {
//     //     const files = e.target.files;
//     //     const formData = new FormData();

//     //     // Append all files to formData
//     //     for (let i = 0; i < files.length; i++) {
//     //         formData.append('files', files[i]);
//     //     }

//     //     await fetch('https://saregamabackend.onrender.com/upload', {
//     //         method: 'POST',
//     //         body: formData,
//     //     });

//     //     const updatedSongs = await fetch('https://saregamabackend.onrender.com/songs').then((res) => res.json());
//     //     setSongs(updatedSongs);
//     // };

//     const uploadSong = async (e) => {
//         const file = e.target.files[0];
//         const formData = new FormData();
//         formData.append('file', file);
//         formData.append('name', file.name);

//         await fetch('https://saregamabackend.onrender.com/upload', {
//             method: 'POST',
//             body: formData,
//         });

//         const updatedSongs = await fetch('https://saregamabackend.onrender.com/songs').then((res) => res.json());
//         setSongs(updatedSongs);
//     };

//     return (
//         <div className="flex flex-col h-screen bg-black text-white">
//             <div className="flex flex-col items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-md shadow-lg rounded-lg m-4">
//                 <h1 className="text-2xl font-bold">{songs[currentSongIndex]?.name || 'Select a Song'}</h1>
//                 <div className="flex gap-4 mt-4">
//                     <button
//                         className="p-4 rounded-full bg-gray-800 hover:bg-gray-700 transition"
//                         onClick={prevSong}
//                     >
//                         <FaStepBackward />
//                     </button>
//                     <button
//                         className="p-4 rounded-full bg-gray-800 hover:bg-gray-700 transition"
//                         onClick={togglePlayPause}
//                     >
//                         {isPlaying ? <FaPause /> : <FaPlay />}
//                     </button>
//                     <button
//                         className="p-4 rounded-full bg-gray-800 hover:bg-gray-700 transition"
//                         onClick={nextSong}
//                     >
//                         <FaStepForward />
//                     </button>
//                 </div>
//                 <div className="mt-4">
//                     <label className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-md cursor-pointer hover:bg-gray-700">
//                         <FaUpload />
//                         <span>Upload Song</span>
//                         <input type="file" onChange={uploadSong} className="hidden" />
//                         {/* <input type="file" onChange={uploadSong} className="hidden" multiple /> */}

//                     </label>
//                 </div>
//             </div>

//             {/* Playlist header and controls */}
//             <div className="mx-4 mb-4">
//                 <div className="flex justify-between items-center">
//                     <h2 className="text-xl font-semibold">Playlist</h2>
//                     <button
//                         className="p-2 bg-gray-800 hover:bg-gray-700 rounded-md transition"
//                         onClick={shuffleSongs}
//                     >
//                         <FaRandom />
//                     </button>
//                 </div>
//             </div>

//             {/* Playlist container */}
//             <div
//                 className="flex-1 overflow-y-auto bg-gray-900 p-4 rounded-lg mx-4"
//                 style={{ height: '50%' }}
//             >
//                 <div className="space-y-2">
//                     {songs.map((song, index) => (
//                         <div
//                             key={song._id}
//                             className={`p-2 rounded-md text-center cursor-pointer ${
//                                 index === currentSongIndex
//                                     ? 'bg-gray-700 font-bold'
//                                     : 'bg-gray-800 hover:bg-gray-700'
//                             }`}
//                             onClick={() => playSong(index)}
//                         >
//                             {song.name}
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default MusicPlayer;
