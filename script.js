
window.onload = () => {
    getCountryData();
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function initMap() {    
    map = new google.maps.Map(document.getElementById("map"), {
      center: {
        lat: -34.397,
        lng: 150.644
      },
      zoom: 8
    });            
}

const getCountryData = () => {
    fetch('https://corona.lmao.ninja/v2/countries')
        .then(response => response.json()) // promise - i have received data from api and it's ok and this is what you do (run this function)
        .then(data => {
            showDataOnMap(data)            
            showDataInTable(data);
        });
}

const showDataOnMap = (data) => { 

    data.map(country =>{
        let countryCenter = {
            lat: country.countryInfo.lat,
            lng: country.countryInfo.long
        }

        var countryCircle = new google.maps.Circle({
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.35,
            map: map,
            center: countryCenter,
            radius: country.casesPerOneMillion * 25
          });        

          var html = `
            <div class="info-container">
                    <div class="info-flag" style="background-image: url(${country.countryInfo.flag});">                      
                    </div>
                    <div class = "info-name">
                       ${country.country}
                    </div>
                    <div class="info-confirmed">
                        Total: ${numberWithCommas(country.cases)}
                    </div>
                    <div class="info-recovered">
                        Recovered: ${numberWithCommas(country.recovered)}
                    </div>
                    <div class = "info-deaths">
                        Deaths: ${numberWithCommas(country.deaths)}
                    </div>               
            </div>
            `
          

          var infoWindow = new google.maps.InfoWindow({
            content: html,
            position: countryCircle.center
        });
    
        var html = "hello";
        google.maps.event.addListener(countryCircle, 'mouseover', function(){      
            infoWindow.open(map);
        })
    
        google.maps.event.addListener(countryCircle, 'mouseout', function(){
            infoWindow.close();
        })
    })

  

    // function createMarker(latlng, name, address) {
    //     var html = "<b>" + name + "</b> <br/>" + address;
    //     var marker = new google.maps.Marker({
    //       map: map,
    //       position: latlng
    //     });
    //     google.maps.event.addListener(marker, 'mouseover', function() {
    //       infoWindow.setContent(html);
    //       infoWindow.open(map, marker);
    //     });
    //     markers.push(marker);
    //   }
    
}

const showDataInTable = (data) => {
    var html = '';
    data.forEach(country => {
        html += `
                 <tr>
                     <td>${country.country}</th>
                     <td>${numberWithCommas(country.cases)}</td>
                     <td>${numberWithCommas(country.recovered)}</td>
                     <td>${numberWithCommas(country.deaths)}</td>
                 </tr>
        `           
    });
    document.getElementById('table-data').innerHTML = html;
}

// Fix table head
function tableFixHead (e) {
    const el = e.target,
          sT = el.scrollTop;
    el.querySelectorAll("thead th").forEach(th => 
      th.style.transform = `translateY(${sT}px)`
    );
}
document.querySelectorAll(".tableFixHead").forEach(el => 
    el.addEventListener("scroll", tableFixHead)
);