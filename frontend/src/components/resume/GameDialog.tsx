
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface GameDialogProps {
  open: boolean;
  onClose: () => void;
  currentItem: {
    type: 'experience' | 'education' | 'awards';
    id: string;
    details: any;
  } | null;
}

const GameDialog: React.FC<GameDialogProps> = ({ open, onClose, currentItem }) => {
  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="bg-terminal-navy border-terminal-text text-terminal-text">
        <DialogHeader>
          <DialogTitle className="text-terminal-accent1">
            {currentItem?.type === 'experience' ? 'Experience Details' : 
             currentItem?.type === 'education' ? 'Education Details' : 'Fun Fact'}
          </DialogTitle>
        </DialogHeader>
        
        <DialogDescription className="text-terminal-text">
          {currentItem?.details && (
            <div className="space-y-2">
              {currentItem.type === 'experience' && (
                <>
                  <h3 className="text-terminal-accent1 font-bold">{currentItem.details.role} at {currentItem.details.company}</h3>
                  <p>{currentItem.details.period} | {currentItem.details.location}</p>
                  <div className="mt-2">
                    <h4 className="text-terminal-accent1">Key Achievements:</h4>
                    <ul className="list-disc pl-5 space-y-1 mt-1">
                      {currentItem.details.achievements.slice(0, 2).map((achievement: string, i: number) => (
                        <li key={i}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
              
              {currentItem.type === 'education' && (
                <>
                  <h3 className="text-terminal-accent1 font-bold">{currentItem.details.degree}</h3>
                  <p>{currentItem.details.institution}</p>
                  <p>{currentItem.details.period} | {currentItem.details.location}</p>
                  {currentItem.details.coursework && (
                    <div className="mt-2">
                      <h4 className="text-terminal-accent1">Key Coursework:</h4>
                      <p>{currentItem.details.coursework}</p>
                    </div>
                  )}
                </>
              )}
              
              {currentItem.type === 'awards' && (
                <>
                  <h3 className="text-terminal-accent1 font-bold">{currentItem.details.title}</h3>
                  <p>{currentItem.details.description}</p>
                </>
              )}
            </div>
          )}
        </DialogDescription>
        
        <div className="flex justify-end mt-4">
          <Button 
            onClick={onClose}
            className="px-4 py-2 bg-terminal-accent1 text-black rounded-md hover:bg-terminal-accent1/80"
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GameDialog;
