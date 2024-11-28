

export const transformToPieData = (paper, eWaste) => {
    return [
        { name: 'Paper Waste (Kg)', value: paper.total_weight },
        { name: 'E-Waste (Units)', value: eWaste.total_units },
    ];
};

export const transformToEWasteData = (eWaste) => {
    const data=eWaste.data
    return data.map((item,index)=>{
        return {
                name: item.name,
                value: item.no_of_units,
            }
    })
   
  
};

export const transformToLineData = (data) => {
    const groupedByMonth = {};
   
    data.forEach((item) => {
        const month = new Date(item.date || item.date_time).toLocaleString('default', { month: 'short' });
        groupedByMonth[month] = (groupedByMonth[month] || 0) + item.weight || item.no_of_units;
    });

    return Object.entries(groupedByMonth).map(([time, value]) => ({ time, value }));
};

export const transformToBarData = (generatedData, soldData) => {
    const combinedData = {};
    console.log(soldData);
    

    generatedData.forEach((item) => {
        const month = new Date(item.date || item.date_time).toLocaleString('default', { month: 'short' });
        combinedData[month] = {
            month,
            generated: item.weight || item.no_of_units,
            sold: 0,
            revenue: 0,
        };
    });

    soldData.forEach((item) => {
        const month = new Date(item.date || item.date_time).toLocaleString('default', { month: 'short' });
        if (combinedData[month]) {
            combinedData[month].sold += item.weight || item.no_of_units;
            combinedData[month].revenue += item.revenue || 0; // Assuming revenue is part of sold data
        }
    });

    return Object.values(combinedData);
};

export const transformToPaperWasteData = (paperWaste) => {
    const groupedByMonth = {};
    const data=paperWaste?.data || []

    data.forEach((item) => {
        const month = new Date(item.date).toLocaleString('default', { month: 'short' });
        if (!groupedByMonth[month]) {
            groupedByMonth[month] = { paperWaste: 0, soldWaste: 0, revenue: 0 };
        }
        groupedByMonth[month].paperWaste += item.weight;
    });

    // Assuming `soldWaste` and `revenue` are separate API data
    // Add them here if available
    return Object.entries(groupedByMonth).map(([month, values]) => ({
        month,
        paperWaste: values.paperWaste,
        soldWaste: values.soldWaste,
        revenue: values.revenue,
    }));
};

