import React, { Component } from "react";
//import items from "./data";
import Room from "./components/Room";
import Client from "./components/Contentful";

const RoomContext = React.createContext();

// <Roomcontext.provider value ={}
class RoomProvider extends Component {
  state = {
    loading: true,
    rooms: [],
    sortedRooms: [],
    featuredRooms: [],
    type: "all",
    capacity: 1,
    price: 0,
    minPrice: 0,
    maxPrice: 0,
    minSize: 0,
    maxSize: 0,
    breakfast: false,
    pet: false
  };

  //getData
  getData = async () => {
    try {
      let response = await Client.getEntries({
        content_type: "reactResort",
        //order: "sys.createdAt" // https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/reverse-order/query-entries/console/js
        order: "-fields.price"
      });
      console.log(response.items);
      let rooms = this.formaData(response.items);
      let featuredRooms = rooms.filter(room => room.featured === true);
      let maxPrice = Math.max(...rooms.map(item => item.price));
      let maxSize = Math.max(...rooms.map(item => item.size));
      this.setState({
        rooms,
        featuredRooms,
        sortedRooms: rooms,
        loading: false,
        price: maxPrice,
        maxPrice,
        size: maxSize,
        maxSize
      });
    } catch (error) {
      console.log(error);
    }
  };
  componentDidMount() {
    this.getData();
    /* let rooms = this.formaData(items);
    let featuredRooms = rooms.filter(room => room.featured === true);
    let maxPrice = Math.max(...rooms.map(item => item.price));
    let maxSize = Math.max(...rooms.map(item => item.size));
    this.setState({
      rooms,
      featuredRooms,
      sortedRooms: rooms,
      loading: false,
      price: maxPrice,
      maxPrice,
      size: maxSize,
      maxSize
    }); */
  }

  getRoom = slug => {
    let tempRooms = [...this.state.rooms];
    const room = tempRooms.find(room => room.slug === slug);
    return room;
  };

  handleChange = e => {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState(
      {
        [name]: value
      },
      this.filterRooms
    );

    //console.log(type, name, value);
  };

  filterRooms = () => {
    let {
      rooms,
      type,
      capacity,
      price,
      minSize,
      maxSize,
      pets,
      breakfast
    } = this.state;
    //all the rooms
    let tempRooms = [...rooms];

    //transform value
    capacity = parseInt(capacity);
    price = parseInt(price);

    //filter by type
    if (type !== "all") {
      tempRooms = tempRooms.filter(room => room.type === type);
    }

    //filter by capacity
    if (capacity !== 1) {
      tempRooms = tempRooms.filter(room => room.capacity === capacity);
    }

    //filter by price
    tempRooms = tempRooms.filter(room => room.price <= price);

    //filter by size
    tempRooms = tempRooms.filter(
      room => room.size <= maxSize && room.size >= minSize
    );
    //filter by breakfsast
    if (breakfast) {
      tempRooms = tempRooms.filter(room => room.breakfast);
    }

    //filter by pets
    if (pets) {
      tempRooms = tempRooms.filter(room => room.pets);
    }

    this.setState({
      sortedRooms: tempRooms
    });
  };

  formaData(items) {
    let tempItems = items.map(item => {
      let id = item.sys.id;
      let images = item.fields.images.map(image => image.fields.file.url);
      let room = { ...item.fields, images, id };
      return room;
    });
    return tempItems;
  }
  render() {
    return (
      <RoomContext.Provider
        value={{
          ...this.state,
          getRoom: this.getRoom,
          handleChange: this.handleChange
        }}
      >
        {this.props.children}
      </RoomContext.Provider>
    );
  }
}

const RoomConsumer = RoomContext.Consumer;

export function withRoomConsumer(Component) {
  return function ConsumerWrapper(props) {
    return (
      <RoomConsumer>
        {value => <Component {...props} context={value}></Component>}
      </RoomConsumer>
    );
  };
}

export { RoomProvider, RoomConsumer, RoomContext };
