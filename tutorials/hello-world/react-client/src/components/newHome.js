import { fetchHelloCounter, fetchLatestHello } from '../api.js';
import styled from 'styled-components';

const Wrapper = style.div``;

const Home = ({data, latestHello}) => {
let [helloCounter, setHelloCounter] = useState();
let [latestHello, setLatestHello] = useState();

  return (
    <Wrapper>
      <h2>Hello Lisk!</h2>
      <p>A simple frontend for blockchain applications built with the Lisk SDK.</p>
      <p>Hello counter:</p>
      {helloCounter}
      <p>Sender:</p>
      {setLatestHello}
    </Wrapper>
  )
}

