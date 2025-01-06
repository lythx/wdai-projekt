interface ProductListItemProps {
  title: string
  category: string
  image: string
}

export default function ProductListItem({ title, category, image }: ProductListItemProps) {
  return (
    <div>
      <div>{title}</div>
      <div>{category}</div>
      <img src={image}></img>
    </div>
  );
}
