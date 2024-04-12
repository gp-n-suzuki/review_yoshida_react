import React, { useState, useRef, useEffect } from 'react';
import VideoJS from './VideoJS';

const initialFilterValues = {
  grayscale: 0,
  blur: 0,
  sepia: 0,
  brightness: 100,
  invert: 0,
  saturate: 100,
  hueRotate: 0,
  opacity: 100
};

const App = () => {
  const [filterValues, setFilterValues] = useState(initialFilterValues);
  const [isFlipped, setIsFlipped] = useState(false);
  const playerRef = useRef(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [scaleValue, setScaleValue] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [videoJsOptions, setVideoJsOptions] = useState({
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [{
      src: 'https://n24-cdn-live-b.ntv.co.jp/ch01/index.m3u8',
      type: 'application/vnd.apple.mpegurl'
    }]
  });

  useEffect(() => {
    const storedFilters = JSON.parse(localStorage.getItem('filters'));
    if (storedFilters) {
      setFilterValues(storedFilters);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
    applyFilters();
    saveFiltersToLocalStorage(filterValues);
 
    }, 500);
  }, [filterValues]);

  const saveFiltersToLocalStorage = filters => {
    localStorage.setItem('filters', JSON.stringify(filters));
  };

  const applyFilters = () => {
    const { grayscale, blur, sepia, brightness, invert, saturate, hueRotate, opacity } = filterValues;
    if (playerRef.current) {
      const videoElement = playerRef.current.el();
      if (videoElement) {
        videoElement.style.filter = `grayscale(${grayscale}%) blur(${blur}px) sepia(${sepia}%) brightness(${brightness}%) invert(${invert}%) saturate(${saturate}%) hue-rotate(${hueRotate}deg) opacity(${opacity}%)`;
      }
    }
  };

  const applyFlipFilter = () => {
    if (playerRef.current) {
      const videoElement = playerRef.current.el();
      if (videoElement) {
        videoElement.style.transform = isFlipped ? 'scaleX(1)' : 'scaleX(-1)';
        setIsFlipped(!isFlipped);
      }
    }
  };

  const resetFilters = () => {
    setFilterValues(initialFilterValues);
    applyFilters();
  };

  const handleUrlInputChange = event => {
    setYoutubeUrl(event.target.value);
  };

  const changeVideoSource = (newUrl) => {
    let type = 'video/youtube';


    if (/\.mp4/.test(newUrl)) {
      type = 'video/mp4';
    } else if (/\.m3u8/.test(newUrl)) {
      type = 'application/vnd.apple.mpegurl';
    
    }
    setVideoJsOptions({
      ...videoJsOptions,
      sources: [{
        src: newUrl,
        type: type
      }]
    });
  };

  const handleScaleChange = event => {
    const value = event.target.value;
    setScaleValue(value);
    applyScaleTransformation(value);
  };

  const applyScaleTransformation = value => {
    if (playerRef.current) {
      const videoElement = playerRef.current.el();
      if (videoElement) {
        videoElement.style.transform = `scale(${value})`;
      }
    }
  };

  const handlePlaybackRateChange = event => {
    const rate = parseFloat(event.target.value);
    setPlaybackRate(rate);
    if (playerRef.current) {
      playerRef.current.playbackRate(rate);
    }
  };

  const handleFilterChange = event => {
    const { name, value } = event.target;
    setFilterValues({
      ...filterValues,
      [name]: value
    });
  };

  const handlePlayerReady = player => {
    playerRef.current = player;
    player.on('waiting', () => {
      VideoJS.log('player is waiting');
    });
    player.on('dispose', () => {
      VideoJS.log('player will dispose');
    });
  };

  return (
    <>
      
      <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
      <div>
      <button onClick={() => changeVideoSource("https://www.youtube.com/watch?v=BiZCOKLXWaU")}>TBS</button>&nbsp; 
      <button onClick={() => changeVideoSource("https://n24-cdn-live-b.ntv.co.jp/ch01/index.m3u8")}>日テレ</button>&nbsp; 
      <button onClick={() => changeVideoSource("https://www.youtube.com/watch?v=pYE3mvuBZNQ")}>ANN</button>
 
     <br />
    
        YoutubeのURL <input type="text" size="40" value={youtubeUrl} onChange={handleUrlInputChange} />
        <button onClick={() => changeVideoSource(youtubeUrl)}>urlを再生</button>
         <br />
        <button onClick={resetFilters}>初期化</button>&nbsp; 
        <button onClick={applyFlipFilter}>左右反転</button>
        <br />
        白黒化 <input type="range" name="grayscale" onChange={handleFilterChange} value={filterValues.grayscale} data-default="0" min="0" max="100" step="1" />{filterValues.grayscale}<br />
        ぼかし <input type="range" name="blur" onChange={handleFilterChange} value={filterValues.blur} data-default="0" min="0" max="10" step="0.1" />{filterValues.blur} <br />
        セピア <input type="range" name="sepia" onChange={handleFilterChange} value={filterValues.sepia} data-default="0" min="0" max="100" step="1" />{filterValues.sepia} <br />
        明るさ <input type="range" name="brightness" onChange={handleFilterChange} value={filterValues.brightness} data-default="100" min="0" max="200" step="1" />{filterValues.brightness} <br />
        反転 <input type="range" name="invert" onChange={handleFilterChange} value={filterValues.invert} data-default="0" min="0" max="100" step="1" />{filterValues.invert}<br />
        彩度 <input type="range" name="saturate" onChange={handleFilterChange} value={filterValues.saturate} data-default="100" min="0" max="200" step="1" />{filterValues.saturate}<br />
        色相 <input type="range" name="hueRotate" onChange={handleFilterChange} value={filterValues.hueRotate} data-default="0" min="0" max="360" step="1" />{filterValues.hueRotate} <br />
        透明度 <input type="range" name="opacity" onChange={handleFilterChange} value={filterValues.opacity} data-default="100" min="0" max="100" step="1" />{filterValues.opacity}<br />
    
サイズ縮小<input type="range" onChange={handleScaleChange}　value={scaleValue}　data-default="1"　min="0.1"　max="1"　step="0.1"/>{scaleValue}
          

      </div>
    </>
  );
};

export default App;
