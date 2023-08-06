import StarRatings from 'react-star-ratings';

export default function StarRating({average}) {

    return (
        <StarRatings
            rating={average}
            starRatedColor="rgb(233, 240, 43)"
            numberOfStars={5}
            name="rating"
            starDimension="20px"
            starSpacing="0px"
        />
    )
}