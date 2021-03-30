import React from "react"
import Svg, { Path, G, SvgXml } from "react-native-svg"

function HomeSvg(props) {


    return (
        <Svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 27.02 27.02"
        {...props}
        >
            <G fill="#030104">
                <Path d="M3.674 24.876s-.024.604.566.604l6.811-.008.01-5.581s-.096-.92.797-.92h2.826c1.056 0 .991.92.991.92l-.012 5.563h6.667c.749 0 .715-.752.715-.752V14.413l-9.396-8.358-9.975 8.358v10.463z" />
                <Path d="M0 13.635s.847 1.561 2.694 0l11.038-9.338 10.349 9.28c2.138 1.542 2.939 0 2.939 0L13.732 1.54 0 13.635zM23.83 4.275h-2.662l.011 3.228 2.651 2.249z" />
            </G>
        </Svg>
    )
}

export default HomeSvg;