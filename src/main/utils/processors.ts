// src/main/utils/processors.ts

export const handleNutrientAmmoniaInput = async (
  sampleId: string,
  modalInputs: Record<string, string>,
  files?: any,
) => {
  try {
    // Extract the 'Ammonia Value' from modalInputs
    const ammoniaValueStr = modalInputs.ammoniaValue;
    const ammoniaValue = parseFloat(ammoniaValueStr);
    console.log(ammoniaValue);
    if (Number.isNaN(ammoniaValue)) {
      throw new Error('Invalid Ammonia Value');
    }

    // Multiply by (17/14) to convert to Ammonium
    const ammoniumValue = ammoniaValue * (17 / 14);

    // Prepare the result to send back to the renderer process
    const result = {
      sampleId,
      data_type: 'nutrient_ammonia',
      data: {
        ammoniaValue,
        ammoniumValue,
      },
    };

    return result;
  } catch (error) {
    console.error('Error in handleNutrientAmmoniaInput:', error);
    throw error;
  }
};
