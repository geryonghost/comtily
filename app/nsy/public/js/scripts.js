if (window.location.pathname == '/' || window.location.pathname == '/search') {
    document
        .getElementById('makes_select')
        .addEventListener('change', function () {
            const querystring = 'make=' + this.value

            // Make an AJAX request to fetch dynamic data from the server
            fetch(`/ajax?${querystring}`)
                .then((response) => response.json())
                .then((data) => {
                    // Empty the select drop down
                    $('#models_select').empty()
                    // Rebuild the select drop down
                    $('#models_select').append(new Option('ALL MODELS', '0'))
                    $.each(data, function (key, Model) {
                        var option = new Option(Model, Model)
                        $(option).html(Model)
                        $('#models_select').append(option)
                    })
                    $('#models_select').prop('disabled', false)
                })
                .catch((error) => {
                    console.error('Error fetching data:', error)
                })
        })
}
