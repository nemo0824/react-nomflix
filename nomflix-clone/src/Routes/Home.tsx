import { color, delay } from "framer-motion";
import { useQueries, useQuery } from "react-query";
import { IGetMoviesResult, getMovies } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import {motion, AnimatePresence} from "framer-motion"
import { useState } from "react";
import { exit } from "process";
import { hover } from "@testing-library/user-event/dist/hover";
import { useNavigate } from "react-router-dom";

const Wrapper = styled.div`
    
    overflow-x: hidden;
`

const Loader = styled.div`
    height: 20vh;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
`
const Banner = styled.div<{bgPhoto:string}>`
    height: 100vh;
    background-color: black;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px;
    background-image: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,1)), url(${props => props.bgPhoto});
    background-size: cover;
`;

const Title = styled.h2`
    font-size: 68px;
    margin-bottom: 20px;
`

const Overview = styled.p`
    font-size: 36px;
    width: 50%;
`

const Slider = styled.div`
    position: relative;
    top: -100px;
`
const Row = styled(motion.div)`
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 5px;
    position: absolute;
    width: 100%;
`;

const Box = styled(motion.div)<{bgPhoto: string}>`
    background-color: white;
    height: 200px;
    background-image: url(${props => props.bgPhoto});
    font-size: 64px;
    background-size: cover;
    background-position: center center;
   
    &:first-child{
       transform-origin: center left;
    }
    &:last-child{
       transform-origin: center right;
    }
`;

const Info = styled(motion.div)`
    padding: 10px;
    background-color: ${props => props.theme.black.lighter};
    opacity: 0;
    position: absolute;
    bottom:0;
    width: 100%;
    h4{
        text-align: center;
        font-size: 18px;
    }
`

const InfoVariants = {
    hover:{
        opacity: 1,
        transition:{
            delay:0.5,
            duration:0.3,
            type:'tween',
        }
    }
}


const rowVariants = {
    hidden: {
        x: window.outerWidth +5
    },
    visible: {
        x:0,
    },
    exit: {
        x: -window.outerWidth -5
    },
}
// window.innerwidth   브라우저 화면의 너비
// window.innerHeight  브라우저 화면의 높이 
// window.outerwidth   브라우저 전체의 너비
// window.innerHeight  브라우저 화면의 높이 

const offSet = 6; 

const boxVariants ={
    normal:{
        scale: 1, 
    },
    hover:{
        y: -50,
        scale: 1.3,
        transition:{
            delay:0.5,
            duration:0.3,
            type:'tween',
        }
    }
}


function Home(){
    const navigate = useNavigate();
   
    const {data , isLoading} = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies)
    console.log(data, isLoading)

    const [index, setIndex] = useState(0)
    const increaseIndex = () =>  {
        if(data){
            if(leaving) return;
            toggleLeaving()
            const totalMovies = data.results.length-1
            const maxIndex = Math.ceil(totalMovies/offSet) -1;
            setIndex((prev) => (prev === maxIndex ? 0 : prev + 1))
        }
      }
    const [leaving, setLeaving] = useState(false)
    const toggleLeaving = () => setLeaving((prev) => !prev) 
    const onBoxClicked = (movieId:number) =>{
        navigate(`/movies/${movieId}`)
    }
    return (
       <Wrapper>{isLoading ? (<Loader>Loading</Loader>): (
       <>
       <Banner onClick={increaseIndex} bgPhoto = {makeImagePath(data?.results[0].backdrop_path || "")}>
        <Title>{data?.results[0].title}</Title>
        <Overview>{data?.results[0].overview}</Overview>
        </Banner>
        <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                <Row 
                key={index} 
                variants={rowVariants} 
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{type:"tween", duration: 1}}
                >
                    {data?.results.slice(1)
                    .slice(offSet*index, offSet*index + offSet)
                    .map((movie) => (
                    <Box 
                        key={movie.id}
                        whileHover= "hover"
                        initial= "normal"
                        variants={boxVariants}
                        transition={{type: 'tween'}}
                        bgPhoto = {makeImagePath(movie.backdrop_path, "w500" )}
                        onClick={()=> onBoxClicked(movie.id)}
                    >
                        {/* 부모요소 안에 Info 들어왔기때문에 variants 같은 요소들이 상속됨 whilehover됨  */}
                        <Info
                            variants={InfoVariants}
                        >
                            <h4>{movie.title}</h4>
                        </Info>
                    </Box>))}
                </Row>
          </AnimatePresence>
        </Slider>
        </>)}</Wrapper>
    )
}

export default Home;