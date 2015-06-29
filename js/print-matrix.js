function printMatrix(matrix, container){

    container.find('tr').each(function(i) { // iterates rows

        $(this).find('td').each(function(j) { // iterates cells from row
            $(this).find('.dynamicProgrammingMatrixCell').val(matrix[i][j].score).attr('traceback', '['+matrix[i][j].traceback+']')
            .prev('.tracebackSelect2').html(parseInt(matrix[i][j].traceback.join(''), 2));
        });

    });
}