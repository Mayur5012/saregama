import React, { useState, useEffect } from 'react';
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaUpload } from 'react-icons/fa';

const MusicPlayer = () => {
    const [songs, setSongs] = useState([]);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [audio, setAudio] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        // fetch('https://saregamabackend.onrender.com/songs')
        fetch('https://saregamabackend.onrender.com/songs')
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to fetch songs');
                }
                return res.json();
            })
            .then((data) => setSongs(data))
            .catch((error) => console.error('Error fetching songs:', error));
    }, []);
    
    const playSong = (index) => {
        const selectedSong = songs[index];
        setCurrentSongIndex(index);
        
        const songUrl = selectedSong.url || `https://saregama.s3.amazonaws.com/${selectedSong._id}`;
        
        console.log("Playing song from URL:", songUrl); // Check URL
        
        const newAudio = new Audio(songUrl);
        
        if (audio) {
            audio.pause();
        }
        
        newAudio.play().catch((error) => {
            console.error('Error playing song:', error);
        });
        
        setAudio(newAudio);
        setIsPlaying(true);
    };
    


    const togglePlayPause = () => {
        if (!audio) {
            console.error('No audio to play');
            return; // Return early if there is no audio object
        }
    
        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            audio.play().catch(error => {
                console.error('Error playing audio:', error);
            });
            setIsPlaying(true);
        }
    };
    

    const prevSong = () => {
        const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        playSong(prevIndex);
    };

    const nextSong = () => {
        const nextIndex = (currentSongIndex + 1) % songs.length;
        playSong(nextIndex);
    };

    const uploadSong = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', file.name);

        await fetch('https://saregamabackend.onrender.com/upload', {
            method: 'POST',
            body: formData,
        });

        const updatedSongs = await fetch('https://saregamabackend.onrender.com/songs').then(res => res.json());
        setSongs(updatedSongs);
    };

    return (
        <div className="app">
            <div className="player">
                <h1 className="song-title">{songs[currentSongIndex]?.name || 'Select a Song'}</h1>
                <div className="controls">
                    <button className="control-btn" onClick={prevSong}>
                        <FaStepBackward />
                    </button>
                    <button className="control-btn" onClick={togglePlayPause}>
                        {isPlaying ? <FaPause /> : <FaPlay />}
                    </button>
                    <button className="control-btn" onClick={nextSong}>
                        <FaStepForward />
                    </button>
                </div>
                <div className="upload-section">
                    <label className="upload-label">
                        <FaUpload className="upload-icon" />
                        <input type="file" onChange={uploadSong} className="upload-input" />
                    </label>
                </div>
            </div>
            <div className="playlist">
                <h2 className="playlist-title">Playlist</h2>
                {songs.map((song, index) => (
                    <div
                        key={song._id}
                        className={`song ${index === currentSongIndex ? 'active-song' : ''}`}
                        onClick={() => playSong(index)}
                    >
                        {song.name}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MusicPlayer;
