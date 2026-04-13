


type SideBarBackDropProps = {
    isOpen: boolean;
    onClick: () => void;
}

export default function SideBarBackDrop({isOpen,onClick }:SideBarBackDropProps) {


    return isOpen ? (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={onClick } />
    ) : null;
}