function printMatrix(matrix, container){

    container.find('tr').each(function(i) { // iterates rows

        $(this).find('td').each(function(j) { // iterates cells from row
            $(this).find('.dynamicProgrammingMatrixCell').val(matrix[i][j].score).attr('traceback', '['+matrix[i][j].traceback+']')
            .prev('.tracebackSelect').find('.arrow').each(function(index, el) {
                if (matrix[i][j].traceback[index+1])
                    $(el).addClass('active');
            });
            if ($(this).find('.arrow').removeClass('alone').filter('.active').length == 1)
                $(this).find('.active').addClass('alone');
        });

    });
}