import React, { useEffect, useState } from 'react';
import Title from "./Title";
import Container from "@material-ui/core/Container";
import { getVideos } from '../services/firebase';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import Video from './Video';
import styles from './Videos.module.css';
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { View, Text, StyleSheet } from 'react-native';
import { lightGreen } from '@material-ui/core/colors';


const useStyles = makeStyles((theme) => ({
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
        width: "100%",
    }
}));
const styles2 = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    fontsizer: {
      fontSize: 40,
      color: "#000",
    },});
const Videos = () => {
    const classes = useStyles();
    const [{ isLoading, data, err }, setState] = useState({ isLoading: true });
    useEffect(() => {
        getVideos()
            .then(snapshot => {
                const videos = [];
                snapshot.docs.forEach(doc => {
                    const video = doc.data();
                    video.id = doc.id;
                    const existingVideo = videos.find(v => v.topic.toLowerCase() === video.topic.toLowerCase());
                    if (!existingVideo) videos.push(video);
                })
                // const videos = snapshot.docs.map(doc => {
                //     const video = doc.data();
                //     video.id = doc.id;
                //     return video;
                // })
                setState({ data: videos })
            })
            .catch(err => setState({ err }))
    }, [])
    return isLoading ? err ? <h1 className={styles.err}>{err.message}</h1> : <CircularProgress /> : (
        <Container maxWidth="lg" className={classes.container}>
             <Text style={styles2.fontsizer}> Videos</Text>
            
            <div className={styles.main}>
                {data.map(video => (
                    <div key={video.id}>
                        <Typography variant="h6">{video.topic}</Typography>
                        <Video url={video.link} />
                    </div>
                ))}
            </div>
        </Container>
    )
}

export default Videos;