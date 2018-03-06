import React from 'react';
import ReactDOM from 'react-dom';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';


export class MapContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            // rating:'',
            address: '',
            showingInfoWindow: false,
            selectedPlace: {},
            activeMarker: {},
            loggedIn: false,
            savedRestaurants: props.userHistory
        }
        
        this.markerClick = this.markerClick.bind(this);
        this.onMapClicked = this.onMapClicked.bind(this);
        this.clickThis = this.clickThis.bind(this);
        this.deleteRestaurant = this.deleteRestaurant.bind(this);
    }
    componentWillReceiveProps(props) {
        // console.log(this.props.userHistory)
        console.log(props)
        let restaurantHistory = props.userHistory
        this.setState({
            savedRestaurants: restaurantHistory
        })
    }
    markerClick(props, marker) {
        this.setState({
            showingInfoWindow: true,
            title: props.title,
            activeMarker: marker,
            address: props.address
            // rating: props.rating


        })
 
    }
    clickThis(){
        const userSave = {
            restaurant: this.state.title,
            address: this.state.address
            // rating: this.state.rating
        }

        const dbRef = firebase.database().ref('/restaurants');
        dbRef.push(userSave);     
    }
    onMapClicked(props) {
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null,
            })
        }
    }
    deleteRestaurant(key) {
        // e.preventDefault();
console.log(key)
        const dbRef = firebase.database().ref(`restaurants/${key}`)
        dbRef.remove();
    }
    render(props) {
        const style = {
            width:'70%',
            height:'80%'
        }
        return (<div className="rightColumn">
            <div className="infoPane">
                    <button onClick={this.clickThis} className="save">Save Restaurant</button>

                {this.state.savedRestaurants.map((restaurant) => {
                    console.log(restaurant)
                    return(
<span key={restaurant.key}>
                        <h5>{restaurant.restaurant}</h5>
                        <p>{restaurant.address}</p>
                        <button value={restaurant.key} onClick={() => this.deleteRestaurant(restaurant.key)}><i class="fas fa-times"></i></button>
</span>
                        
                    )
                    
                })}


            </div>
            <Map google={this.props.google} zoom={13} onClick={this.onMapClicked} center={this.props.coords} style={style}>
              {Object.values(this.props.locations).map(
                (location, i) => {
                  return (
                    <Marker
                      name={"Toronto"}
                      title={location.name}
                      address={location.address}
                      position={{
                        lat: location.latitude,
                        lng: location.longitude
                      }}
                      onClick={this.markerClick}
                      name={"Current location"}
                      key={i}
                    />
                  );
                }
              )}
              <InfoWindow marker={this.state.activeMarker} onClose={this.onInfoWindowClose} visible={this.state.showingInfoWindow}>
                <div className="results">
                  <h2>{this.state.title}</h2>
                  <p className="locationAddress">
                    {this.state.address}
                  </p>
                </div>
              </InfoWindow>
            </Map>
          </div>
        )
    }
}

export default GoogleApiWrapper({
    apiKey: ('AIzaSyCNX1tthuQLaX98UVGv2dcbFnpjdhw0TnQ')
})(MapContainer)