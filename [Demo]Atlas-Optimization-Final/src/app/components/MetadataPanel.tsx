import { useState, useEffect } from 'react';
import { Edit2, CheckSquare, Square, Minus, ChevronRight, RefreshCw } from 'lucide-react';

type FieldStatus = 'unconfirmed' | 'confirmed' | 'edited';

interface Field {
  id: string;
  label: string;
  value: string;
  status: FieldStatus;
}

interface Block {
  id: string;
  fields: Field[];
}

interface MetadataPanelProps {
  onClose: () => void;
}

export default function MetadataPanel({ onClose }: MetadataPanelProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'blocks'>('basic');
  const [blocks, setBlocks] = useState<Block[]>([
    {
      id: 'block1',
      fields: [
        { id: 'f1', label: 'Input Dataset(s)', value: 'ADSL', status: 'unconfirmed' },
        { id: 'f2', label: 'Program Name', value: 't_dm', status: 'unconfirmed' },
        { id: 'f3', label: 'Output Dataset', value: 'ADEFF', status: 'unconfirmed' },
        { id: 'f4', label: 'Population', value: 'Safety', status: 'unconfirmed' },
      ],
    },
  ]);

  // Calculate summary statistics
  const totalFields = blocks.reduce((sum, block) => sum + block.fields.length, 0);
  const confirmedCount = blocks.reduce(
    (sum, block) => sum + block.fields.filter(f => f.status === 'confirmed').length,
    0
  );
  const hasAnyEdits = blocks.some(block => block.fields.some(f => f.status === 'edited'));

  // Count confirmable fields (exclude edited fields)
  const confirmableFields = blocks.reduce(
    (sum, block) => sum + block.fields.filter(f => f.status !== 'edited').length,
    0
  );

  // Calculate select-all checkbox state
  // Checked: all confirmable fields are confirmed
  // Empty: no fields are confirmed
  // Indeterminate: some but not all confirmable fields are confirmed
  const selectAllState: 'empty' | 'indeterminate' | 'checked' =
    confirmedCount === 0
      ? 'empty'
      : confirmedCount === confirmableFields
      ? 'checked'
      : 'indeterminate';

  const handleConfirm = (blockId: string, fieldId: string) => {
    setBlocks(prevBlocks =>
      prevBlocks.map(block =>
        block.id === blockId
          ? {
              ...block,
              fields: block.fields.map(field =>
                field.id === fieldId
                  ? { ...field, status: field.status === 'confirmed' ? 'unconfirmed' : 'confirmed' as FieldStatus }
                  : field
              ),
            }
          : block
      )
    );
  };

  const handleSelectAll = () => {
    // Empty or Indeterminate → Confirm all
    // Checked → Unconfirm all
    const shouldConfirmAll = selectAllState === 'empty' || selectAllState === 'indeterminate';
    setBlocks(prevBlocks =>
      prevBlocks.map(block => ({
        ...block,
        fields: block.fields.map(field => {
          // Skip edited fields - they maintain their edited status
          if (field.status === 'edited') return field;
          return { ...field, status: shouldConfirmAll ? 'confirmed' : 'unconfirmed' as FieldStatus };
        }),
      }))
    );
  };

  const handleFieldEdit = (blockId: string, fieldId: string, newValue: string) => {
    setBlocks(prevBlocks =>
      prevBlocks.map(block =>
        block.id === blockId
          ? {
              ...block,
              fields: block.fields.map(field =>
                field.id === fieldId
                  ? { ...field, value: newValue, status: 'edited' as FieldStatus }
                  : field
              ),
            }
          : block
      )
    );
  };

  const handleUpdateCode = () => {
    setBlocks(prevBlocks =>
      prevBlocks.map(block => ({
        ...block,
        fields: block.fields.map(field =>
          field.status === 'edited'
            ? { ...field, status: 'unconfirmed' as FieldStatus }
            : field
        ),
      }))
    );
  };

  const getFieldStyles = (status: FieldStatus) => {
    switch (status) {
      case 'unconfirmed':
        return {
          containerBg: 'bg-white',
          containerBorder: 'border-transparent',
          inputBorder: 'border-[#999]',
          checkboxIcon: Square,
          checkboxColor: 'text-[#888E8E]',
          showDropdown: true,
        };
      case 'edited':
        return {
          containerBg: 'bg-[#fceecc]',
          containerBorder: 'border-[#f0ab00]',
          inputBorder: 'border-transparent',
          checkboxIcon: CheckSquare,
          checkboxColor: 'text-[#f0ab00]',
          showDropdown: false,
        };
      case 'confirmed':
        return {
          containerBg: 'bg-[#f3f7cc]',
          containerBorder: 'border-[#c4d600]',
          inputBorder: 'border-transparent',
          checkboxIcon: CheckSquare,
          checkboxColor: 'text-[#1e7e34]',
          showDropdown: false,
        };
    }
  };

  return (
    <div className="h-full w-full bg-white border-r border-[#e5e8e8] flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="bg-white h-[40px] relative shrink-0 w-full border-b border-[#d8dada]">
        <div className="flex items-center justify-between h-full">
          {/* View Toggle */}
          <div className="flex items-center h-full">
            <button
              onClick={() => setActiveTab('basic')}
              className={`flex items-center justify-center px-[16px] py-[8px] h-full border-b-2 transition-colors active:scale-[0.96] transition-transform ${
                activeTab === 'basic' ? 'border-[#830051]' : 'border-transparent'
              }`}
            >
              <p className={`font-['PingFang_SC:Medium',sans-serif] text-[12px] leading-[normal] whitespace-nowrap ${
                activeTab === 'basic' ? 'text-[#830051]' : 'text-[#3c4242]'
              }`}>
                Basic info
              </p>
            </button>
            <button
              onClick={() => setActiveTab('blocks')}
              className={`flex items-center justify-center px-[16px] py-[8px] h-full border-b-2 transition-colors active:scale-[0.96] transition-transform ${
                activeTab === 'blocks' ? 'border-[#830051]' : 'border-transparent'
              }`}
            >
              <p className={`font-['PingFang_SC:Medium',sans-serif] text-[12px] leading-[normal] whitespace-nowrap ${
                activeTab === 'blocks' ? 'text-[#830051]' : 'text-[#3c4242]'
              }`}>
                Blocks
              </p>
            </button>
          </div>

          {/* Tool Bar */}
          <div className="flex items-center pr-[12px]">
            <button
              className="size-[24px] flex items-center justify-center rounded-[4px] hover:bg-black/5 transition-colors active:scale-[0.96] transition-transform"
              aria-label="Batch edit"
            >
              <Edit2 className="size-4 text-[#888E8E]" />
            </button>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-[#f8f7f7] px-[12px] py-[8px] flex items-center justify-end">
        <div className="flex items-center gap-[6px]">
          {/* Select All Checkbox */}
          <button
            onClick={handleSelectAll}
            className="size-[20px] flex items-center justify-center hover:bg-black/5 rounded-[2px] transition-colors active:scale-[0.96] transition-transform"
            aria-label="Select all"
          >
            {selectAllState === 'empty' && (
              <Square className="size-[18px] text-[#888E8E]" strokeWidth={1.5} />
            )}
            {selectAllState === 'indeterminate' && (
              <div className="size-[18px] border-[1.5px] border-[#888E8E] rounded-[2px] flex items-center justify-center">
                <div className="w-[10px] h-[1.5px] bg-[#888E8E]" />
              </div>
            )}
            {selectAllState === 'checked' && (
              <CheckSquare className="size-[18px] text-[#1e7e34]" strokeWidth={1.5} />
            )}
          </button>

          {/* Status Text */}
          <p className="font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[16px] text-[#3c4242] whitespace-nowrap">
            {confirmedCount}/{totalFields} confirmed
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-[4px]">
        {activeTab === 'basic' && (
          <div className="flex flex-col gap-[4px]">
            {blocks.map((block) =>
              block.fields.map((field) => {
                const styles = getFieldStyles(field.status);
                const CheckboxIcon = styles.checkboxIcon;
                return (
                  <div
                    key={field.id}
                    className={`${styles.containerBg} rounded-[4px] border ${styles.containerBorder}`}
                  >
                    <div className="flex flex-col gap-[4px] p-[8px]">
                      {/* Label Row */}
                      <div className="flex items-center justify-between h-[20px]">
                        <p className="font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px] text-[#3c4242]">
                          {field.label}
                        </p>
                        <button
                          onClick={() => handleConfirm(block.id, field.id)}
                          className="size-[24px] flex items-center justify-center rounded-[4px] hover:bg-black/5 transition-colors active:scale-[0.96] transition-transform"
                          aria-label={field.status === 'confirmed' ? 'Unconfirm' : 'Confirm'}
                        >
                          <CheckboxIcon className={`size-4 ${styles.checkboxColor}`} />
                        </button>
                      </div>

                      {/* Input Row */}
                      <div className="relative">
                        <input
                          type="text"
                          value={field.value}
                          onChange={(e) => handleFieldEdit(block.id, field.id, e.target.value)}
                          className={`w-full min-h-[32px] px-[8px] py-[4px] bg-white rounded-[2px] border ${styles.inputBorder} font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px] text-black focus:outline-none break-words`}
                        />
                        {styles.showDropdown && (
                          <div className="absolute right-[8px] top-[8px] pointer-events-none">
                            <ChevronRight className="size-4 text-[#999]" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
        {activeTab === 'blocks' && (
          <div className="flex flex-col gap-[8px] p-[4px]">
            <p className="font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px] text-[#666]">
              Block information will appear here
            </p>
          </div>
        )}
      </div>

      {/* Update Code Button - Fixed at bottom */}
      {hasAnyEdits && (
        <div className="p-[12px] border-t border-[#d8dada]">
          <button
            onClick={handleUpdateCode}
            className="w-full flex items-center justify-center gap-[4px] h-[32px] px-[12px] py-[8px] bg-[#830051] rounded-[4px] hover:bg-[#6d0043] transition-colors active:scale-[0.96] transition-transform"
          >
            <RefreshCw className="size-4 text-white" />
            <p className="font-['PingFang_SC:Regular',sans-serif] text-[12px] leading-[20px] text-white">Add Changes to Chat</p>
          </button>
        </div>
      )}
    </div>
  );
}
