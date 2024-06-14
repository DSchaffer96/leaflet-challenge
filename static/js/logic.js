let myMap=L.map("map",{
    center:[40,-110],
    zoom:5
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

let queryURL="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(queryURL).then(function(data){
    createFeatures(data.features);
})

function markerColor(depth){
    if(depth<10) {
        return"#a3f600";
    }
    else if(depth<30) {
        return "#dcf400";
    }
    else if(depth<50) {
        return "#f7db11";
    }
    else if(depth<70) {
        return "#fdb72a";
    }
    else if(depth<90) {
        return "#fca35d";
    }
    else{
        return "#ff5f65";
    }
}
function markerRadius(magnitude){
    if(magnitude==0){
        return 1;
    }
    else{
        return Math.sqrt(magnitude*10);
    }
}
function createFeatures(feat){
    for(let i=0;i<feat.length;i++){
        let geo=feat[i].geometry;
        let prop=feat[i].properties;

        let newCircle=L.circleMarker([geo.coordinates[1],geo.coordinates[0],{
        }]).bindPopup(`<h1>${prop.title}</h1>`)

        newCircle.setStyle({
            weight:1,
            stroke:true,
            color:markerColor(geo.coordinates[2]),
            fillColor:markerColor(geo.coordinates[2]),
            fillOpacity:0.75,
            radius:markerRadius(prop.mag),
        });
        
        newCircle.addTo(myMap);
    }

    let legend=L.control({position:'bottomright'});
    legend.onAdd=function(map){
        let div=L.DomUtil.create('div','info legend');
        let limits=[-10,10,30,50,70,90];
        let labels=[];

        for(let i=0;i<limits.length;i++){
            div.innerHTML +=
                `<i style="background:`+markerColor(limits[i]+1)+`"></i>`+
                limits[i]+(limits[i+1] ? `&ndash;`+limits[i+1]+`<br>` : `+`);
        }
        return div;
    };
    legend.addTo(myMap);
}