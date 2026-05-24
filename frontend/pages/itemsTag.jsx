import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import ItemCard from '@/src/components/ItemCard';
import { config } from '@/data/axiosData';
import Layout from '@/src/layouts/Layout';

const ItemsTag = () => {
  const searchParams = useSearchParams();
  const [groupedItems, setGroupedItems] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get tags and stringify for useEffect dependency
  const tags = searchParams.getAll('tag');
  const tagsString = JSON.stringify(tags);

  useEffect(() => {
    if (tags.length > 0) {
      const fetchItemsByTags = async () => {
        try {
          setLoading(true);
          setError(null);
          
          const response = await axios.post(
            `http://localhost:4000/api/customer/getFoodItemsByTags`,
            { tags },
            config
          );

          const itemsGroupedByRestaurant = response.data.matchedItems.reduce((acc, item) => {
            const restaurantId = item.restaurantId;
            if (!acc[restaurantId]) {
              acc[restaurantId] = {
                restaurant: item.restaurant,
                items: []
              };
            }
            acc[restaurantId].items.push(item);
            return acc;
          }, {});

          setGroupedItems(itemsGroupedByRestaurant);
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to fetch items');
          console.error('Error fetching items:', err);
        } finally {
          setLoading(false);
        }
      };

      const debounceTimer = setTimeout(fetchItemsByTags, 300);
      return () => clearTimeout(debounceTimer);
    }
  }, [tagsString]);

  return (
   <Layout>
     <div className="container" style={{paddingTop: '120px'}}>
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="mb-3 text-warning">
            {tags.length === 1 
              ? `Items tagged with "${tags[0]}"` 
              : `Items tagged with ${tags.join(', ')}`}
          </h1>
          {loading && (
            <div className="alert alert-warning">
              <div className="spinner-border text-warning me-2" role="status"></div>
              Loading items...
            </div>
          )}
          {error && (
            <div className="alert alert-warning bg-warning bg-opacity-10 border border-warning border-opacity-25">
              {error}
            </div>
          )}
        </div>
      </div>

      {Object.keys(groupedItems).length > 0 ? (
        Object.entries(groupedItems).map(([restaurantId, group]) => (
          <div key={restaurantId} className="restaurant-group mb-5">
            <div className="restaurant-header mb-4 p-3 bg-warning bg-opacity-10 rounded">
              <h2 className="text-warning">{group.restaurant.name}</h2>
              <p className="text-warning-emphasis mb-2">
                {group.restaurant.address}
                {group.restaurant.phone !== "No contact available" && (
                  <span> • {group.restaurant.phone}</span>
                )}
              </p>
              {/* {group.restaurant.photoUrl && (
                <img 
                  src={"https://content.jdmagicbox.com/comp/jamshedpur/l2/0657px657.x657.221010114213.e5l2/catalogue/hotel-trax-international-sakchi-jamshedpur-restaurants-x0da6rvi08.jpg"} 
                  alt={group.restaurant.name} 
                  className="img-fluid rounded mb-3 border border-warning border-2"
                  style={{ maxHeight: '200px', width: 'auto' }}
                />
              )} */}
            </div>
            
            <div className="row">
              {group.items.map(item => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        ))
      ) : (
        !loading && (
          <div className="col-12">
            <div className="alert alert-warning bg-warning bg-opacity-10 border border-warning border-opacity-25">
              {tags.length > 0 
                ? "No items found with these tags" 
                : "No tags specified"}
            </div>
          </div>
        )
      )}
    </div>
   </Layout>
  );
};

export default ItemsTag;