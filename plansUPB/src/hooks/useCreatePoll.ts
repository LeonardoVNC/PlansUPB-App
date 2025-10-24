import { useState } from 'react';
import { generateUUID } from '../utils/idGenerator';

export type CloseCriteria = 'deadline' | 'quorum' | 'none';
export type TiebreakMethod = 'oldest_first' | 'creator_decides';

export interface CreatePollData {
  question: string;
  description: string;
  allowMultiple: boolean;
  closeCriteria: CloseCriteria; // 'deadline' | 'quorum'
  closeDate?: Date;
  quorumCount: string;
  tiebreakMethod: TiebreakMethod; // 'oldest_first' | 'creator_decides'
  options: string[];
}

export const useCreatePoll = (initialState?: Partial<CreatePollData>) => {
  const [formData, setFormData] = useState<CreatePollData>({
    question: '',
    description: '',
    allowMultiple: false,
    closeCriteria: 'none',
    closeDate: undefined,
    quorumCount: '8',
    tiebreakMethod: 'oldest_first',
    options: ['', ''],
    ...initialState
  });

  const updateField = (field: keyof CreatePollData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleInputChange = (field: keyof CreatePollData) => 
    (value: string) => updateField(field, value);

  const addOption = () => {
    if (formData.options.length < 5) {
      setFormData(prev => ({
        ...prev,
        options: [...prev.options, '']
      }));
    }
  };

  const removeOption = (index: number) => {
    if (formData.options.length > 2) {
      setFormData(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    updateField('options', newOptions);
  };

  const validateForm = (): boolean => {
    if (!formData.question.trim()) {
      alert('Por favor ingresa una pregunta');
      return false;
    }

    const validOptions = formData.options.filter(opt => opt.trim() !== '');
    if (validOptions.length < 2) {
      alert('Debes tener al menos 2 opciones válidas');
      return false;
    }

    return true;
  };

  const preparePollData = async (planId?: string) => {
    if (!validateForm()) return null;

    const validOptions = formData.options.filter(opt => opt.trim() !== '');
    const pollOptions = await Promise.all(
      validOptions.map(async (text) => ({
        id: await generateUUID(),
        text: text.trim(),
        votes: 0
      }))
    );

    return {
      id: await generateUUID(),
      planId,
      question: formData.question.trim(),
      description: formData.description.trim() || undefined,
      allowMultiple: formData.allowMultiple,
      createdAt: new Date(),
      closesAt: formData.closeCriteria === 'deadline' && formData.closeDate 
        ? formData.closeDate
        : undefined,
      options: pollOptions,
      votes: [],
      closeCriteria: formData.closeCriteria,
      quorumCount: formData.closeCriteria === 'quorum' 
        ? parseInt(formData.quorumCount) 
        : undefined,
      tiebreakMethod: formData.tiebreakMethod,
      isOpen: true,
    };
  };

  const resetForm = () => {
    setFormData({
      question: '',
      description: '',
      allowMultiple: false,
      closeCriteria: 'none',
      closeDate: undefined,
      quorumCount: '8',
      tiebreakMethod: 'oldest_first',
      options: ['', '']
    });
  };

  return {
    formData,
    updateField,
    handleInputChange,
    addOption,
    removeOption,
    updateOption,
    preparePollData,
    resetForm
  };
};
