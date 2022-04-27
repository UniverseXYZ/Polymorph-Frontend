import { useRouter } from 'next/router'
import BurnToMintSectionImage from '../../../assets/images/burn-to-mint-section-image.png'
import WrapperCenter from '../../polymorphs/WrapperCenter';
import WrapperCenterTwoColumns from '../../polymorphs/WrapperCenterTwoColumns';
import { AnimatedOnScroll } from 'react-animated-css-onscroll';
import Button from '../../button/Button';

const row1RightBlock = () => {
    const router = useRouter();

    return (
        <>
            <AnimatedOnScroll animationIn="fadeIn" animationInDelay={200}>
            <h2>Burn To Mint</h2>
            <p>
                Polymorph holders are invited to burn their original NFTs to mint brand new ones. 
                The same Polymorphs you know and love but with brand new possibilities. 
            </p>
            <Button className="light-button" onClick={() => router.push('/burn-to-mint')}>Learn More</Button>
            </AnimatedOnScroll>
        </>
    )
};

const BurnToMintSection = () => {
    const router = useRouter();
    
    return (
        <div className='burnToMint__section'>
            <WrapperCenter className="burnToMint--wrapper--row1">
                <WrapperCenterTwoColumns
                    leftBlock={
                        <AnimatedOnScroll animationIn="fadeIn" animationInDelay={500}>
                        <img alt="img" src={BurnToMintSectionImage} />
                        </AnimatedOnScroll>
                    }
                    rightBlock={row1RightBlock()}
                    rightClassName="burn--incentive"
                    leftClassName="polymorph--section1--row1--left--block"
                />
            </WrapperCenter>
        </div>
    )
}

export default BurnToMintSection;