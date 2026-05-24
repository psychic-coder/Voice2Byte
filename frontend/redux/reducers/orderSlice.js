import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
  completed: false,
  restaurantId: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    addOrder: (state, action) => {
      if (state.orders.length === 0) {
        state.restaurantId = action.payload[0].restaurantId;
      }

      const isSameRestaurant = action.payload.every(
        (item) => item.restaurantId === state.restaurantId
      );

      if (!isSameRestaurant) {
        state.orders = action.payload;
        state.restaurantId = action.payload[0].restaurantId;
      } else {
        const newOrders = [...state.orders];

        action.payload.forEach((newItem) => {
          const existingIndex = newOrders.findIndex(
            (item) => item.itemId === newItem.itemId
          );

          if (existingIndex >= 0) {
            newOrders[existingIndex] = newItem;
          } else {
            newOrders.push(newItem);
          }
        });

        state.orders = newOrders;
      }

      state.completed = false;
    },
    updateQuantity: (state, action) => {
      const { itemId, quantity } = action.payload;
      const itemIndex = state.orders.findIndex(
        (item) => item.itemId === itemId
      );

      if (itemIndex >= 0) {
        state.orders[itemIndex].quantity = quantity;
      }
    },
    deleteOrder: (state, action) => {
      state.orders = state.orders.filter(
        (order) => order.itemId !== action.payload
      );
      if (state.orders.length === 0) {
        state.restaurantId = null;
      }
    },
    clearOrders: (state) => {
      state.orders = [];
      state.restaurantId = null;
      state.completed = false;
    },
    completeOrders: (state) => {
      if (state.orders.length > 0) {
        state.completed = true;
        state.orders = [];
        state.restaurantId = null;
      }
    },
    expireOrders: (state) => {
      state.orders = [];
      state.restaurantId = null;
      state.completed = false;
    },
    setOrders: (state, action) => {
      state.orders = action.payload;
      state.restaurantId =
        action.payload.length > 0 ? action.payload[0].restaurantId : null;
      state.completed = false;
    },
  },
});

export const {
  addOrder,
  updateQuantity,
  deleteOrder,
  clearOrders,
  completeOrders,
  expireOrders,
  setOrders,
} = orderSlice.actions;

export default orderSlice.reducer;
