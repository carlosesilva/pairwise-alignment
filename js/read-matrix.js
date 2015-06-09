/**
 * Read data from dynamicProgrammingMatrix table into an array
 * @param  {object} dynamicProgrammingMatrix
 * @return {array} S
 */
function dynamicProgrammingMatrixRead (dynamicProgrammingMatrix) {
    var S = [];

    dynamicProgrammingMatrix.find('tr').each(function() {
        var row = [];
        $(this).find('td').each(function() {
            row.push($(this).find('input').val());
        });
        S.push(row);
    });
    return S;
}