// Google to JSON API
const gsheet_id = '1z-rXlasV9g2PerZz8uiVtuCEmY192U0LyJA3oWyo9i8';
const gsheet_deals_api = `https://spreadsheets.google.com/feeds/list/${gsheet_id}/od6/public/values?alt=json`;

// DOM Handlers
let thegroup_deals = document.getElementById('thegroup_deals');

// Fetching Google JSON Data
function get_all_deals(callback) { 
    fetch(gsheet_deals_api)
        .then(response => response.json())
        .then(data => { 
            callback(data);
            $(document).ready(function() {
                $('#thegroup_table-of-deals').DataTable();
            } );
        })
        .catch(err => console.log(err));
}

// Callback function for FETCH
function process_all_deals(data) {
    let rows = data.feed.entry;
    let deal_details = rows.filter(row => row);

    deal_details.forEach((row, index) => {
        let html_insert = `<tr>
                <td>${row.gsx$agent.$t}</td>
                <td>${row.gsx$property.$t}</td>
                <td>${row.gsx$clients.$t}</td>
                <td>${row.gsx$count.$t}</td>
                <td>${row.gsx$dealtype.$t}</td>
                <td>${row.gsx$leadtype.$t}</td>
                <td>${row.gsx$teamsplit.$t}</td>
                <td>${row.gsx$tier.$t}</td>
            </tr>`;
        
        thegroup_deals.innerHTML += html_insert;
    });
}

// Calling the function to fetch and passing a callback
get_all_deals(process_all_deals);



/****************************
 * CHART JS
*****************************/

// Fetching Google JSON Data
function get_gsheet_data() { 
    fetch(gsheet_deals_api)
        .then(response => response.json())
        .then(data => { 
            let rows = data.feed.entry;

            let list_side = rows.filter(row => row.gsx$dealtype.$t === 'List');
            let buyer_side = rows.filter(row => row.gsx$dealtype.$t === 'Buy');
            let double_end = rows.filter(row => row.gsx$dealtype.$t === 'Double-End');

            let team_leads = rows.filter(row => row.gsx$leadtype.$t === 'Team Lead');
            let agent_soi = rows.filter(row => row.gsx$leadtype.$t === 'SOI');
            // array values based on filters
            const deal_types = [
                buyer_side.length,
                list_side.length,
                double_end.length
            ];
            // array values based on filters
            const lead_source = [
                team_leads.length,
                agent_soi.length
            ];

            dealTypes_piechart(deal_types);

            leadSource_piechart(lead_source);
        })
        .catch(err => console.log(err));
    
}

// Calling the function to fetch API data
get_gsheet_data();

// Function to display chart for Deal Types
function dealTypes_piechart(arr) { 
    var ctx = document.getElementById('dealTypes');
    var myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Buyer Side', 'List Side', 'Double-End', ],
            datasets: [{
                label: 'Deal Types',
                data: arr,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                ],
                borderWidth: 3
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

// Function to display chart for Lead Source
function leadSource_piechart(arr) { 
    var ctx = document.getElementById('leadSource');
    var myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Team Lead', 'Agent SOI', ],
            datasets: [{
                label: 'Lead Source',
                data: arr,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                ],
                borderWidth: 3
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });

}