import React from 'react';
import styles from './video.module.css';

const Video = ({ url, className, height = "66.055%" }) => {
    const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/);
    return match && (
        <div className={`${styles.root} ${className}`} style={{paddingTop: height}}>
            <iframe src={`https://www.youtube.com/embed/${match[2]}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className={styles.iframe}></iframe>
        </div>
    )
}

export default Video;