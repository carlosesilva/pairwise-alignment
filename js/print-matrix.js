function printMatrix(matrix, container){

    container.find('tr').each(function(i) { // iterates rows

        $(this).find('td').each(function(j) { // iterates cells from row
            $(this).find('.dynamicProgrammingMatrixCell').val(matrix[i][j].score);
        });

    });
}