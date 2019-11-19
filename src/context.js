import React, { Component } from "react";
import items from "./data";
import Room from "./components/Room";
const RoomContext = React.createContext();

// <Roomcontext.provider value ={}
class RoomProvider extends Component {
  state = {
    rooms: [],
    sortedRooms: [],
    featuredRooms: [],
    loading: true
  };
  // getdata{}

  getRoom = slug => {
    let tempRooms = [...this.state.rooms];
    const room = tempRooms.find(room => room.slug === slug);
    return room;
  };

  componentDidMount() {
    // this.getData
    let rooms = this.formaData(items);
    let featuredRooms = rooms.filter(room => room.featured === true);
    this.setState({
      rooms,
      featuredRooms,
      sortedRooms: rooms,
      loading: false
    });
  }

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
      <RoomContext.Provider value={{ ...this.state, getRoom: this.getRoom }}>
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
