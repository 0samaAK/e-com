import React from 'react'
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingSpinner from "./Loading";


const PeopleAlsoBought = () => {
	
	const [ recommendations, setRecommendations ] = useState([]);
	const [ isLoading, setIsLoading ] = useState(true);

	useEffect(() => {
		const fetchRecommendations = async () => {
			
			try {
				const res = await axios.get("http://localhost:3000/api/product/recommended");
				setRecommendations(res.data.data)

			} catch (error) {

				toast.error(error?.response?.data?.message || "An error occurred while fetching recommendations");
			
      		} finally {

				setIsLoading(false);
			
     	 	}
		
    	}

		fetchRecommendations();
	
	}, []);

	if (isLoading) return <LoadingSpinner />;
	
	return (
    	<div className = 'mt-8'>
			<h3 className = 'text-2xl font-semibold py-5 text-emerald-400'>People Also Bought</h3>
			<div className = 'mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg: grid-col-3'>
				{
          			recommendations?.map((product) => (
            			<ProductCard key = { product.id } product = { product } />
          			))
        		}
			</div>
		</div>
  	)
}

export default PeopleAlsoBought